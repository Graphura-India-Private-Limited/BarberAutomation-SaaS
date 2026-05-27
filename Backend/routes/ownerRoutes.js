const express      = require("express");
const router       = express.Router();
const Salon        = require("../models/Salon");
const Barber       = require("../models/Barber");
const Booking      = require("../models/Booking");
const Queue        = require("../models/Queue");
const BreakRequest = require("../models/BreakRequest");
const { protect }  = require("../middleware/authMiddleware");

/* ═══════════════════════════════════════════════
   DASHBOARD STATS
═══════════════════════════════════════════════ */
router.get("/salon/:salon_id/dashboard", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const barbers = await Barber.find({ salon_id: req.params.salon_id, is_active: true });

    const [pending, completed, liveQ, pendingBreaks] = await Promise.all([
      Booking.countDocuments({ salon_id: req.params.salon_id, status: "pending",   created_at: { $gte: today } }),
      Booking.countDocuments({ salon_id: req.params.salon_id, status: "completed", created_at: { $gte: today } }),
      Queue.countDocuments({   salon_id: req.params.salon_id, status: { $in: ["waiting", "in-progress"] } }),
      BreakRequest.find({ status: "pending" }).populate("barber_id", "name"),
    ]);

    res.json({
      success: true,
      barbers,
      todayStats: { pending, completed },
      liveQueueCount: liveQ,
      pendingBreakRequests: pendingBreaks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   BREAK REQUESTS
═══════════════════════════════════════════════ */
router.get("/salon/:salon_id/break-requests", protect, async (req, res) => {
  try {
    const barbers = await Barber.find({ salon_id: req.params.salon_id }, "_id");
    const ids     = barbers.map(b => b._id);
    const requests = await BreakRequest.find({ barber_id: { $in: ids } })
      .populate("barber_id", "name mobile")
      .sort({ created_at: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/break-request/:id", protect, async (req, res) => {
  try {
    const { status, owner_note } = req.body;
    const breakReq = await BreakRequest.findByIdAndUpdate(
      req.params.id,
      { status, owner_note: owner_note || "" },
      { new: true }
    );
    if (status === "approved") {
      await Barber.findByIdAndUpdate(breakReq.barber_id, { status: "break" });
      await Queue.updateMany(
        { barber_id: breakReq.barber_id, status: "waiting" },
        { status: "paused" }
      );
    }
    res.json({ success: true, message: `Break ${status}`, request: breakReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   QUEUE — REASSIGN
═══════════════════════════════════════════════ */
router.put("/queue/:queue_id/reassign", protect, async (req, res) => {
  try {
    const { new_barber_id } = req.body;
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });

    const newPos = await Queue.countDocuments({ barber_id: new_barber_id, status: "waiting" }) + 1;

    await Queue.findByIdAndUpdate(req.params.queue_id, { barber_id: new_barber_id, position: newPos });
    await Booking.findByIdAndUpdate(q.booking_id, { barber_id: new_barber_id });

    if (q.barber_id) {
      await Queue.updateMany(
        { barber_id: q.barber_id, status: "waiting", position: { $gt: q.position } },
        { $inc: { position: -1 } }
      );
    }
    res.json({ success: true, message: "Reassigned!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   ★ MANUAL ASSIGN
═══════════════════════════════════════════════ */
router.post("/queue/:queue_id/assign", protect, async (req, res) => {
  try {
    const { barber_id } = req.body;
    if (!barber_id) return res.status(400).json({ success: false, message: "barber_id is required" });

    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });

    const barber = await Barber.findOne({ _id: barber_id, salon_id: q.salon_id, is_active: true });
    if (!barber) return res.status(400).json({ success: false, message: "Invalid barber for this salon" });

    const newPos = await Queue.countDocuments({ barber_id, status: "waiting" }) + 1;

    await Queue.findByIdAndUpdate(req.params.queue_id, { barber_id, position: newPos });
    await Booking.findByIdAndUpdate(q.booking_id, { barber_id });

    res.json({
      success: true,
      message: `Assigned to ${barber.name}`,
      barber: { _id: barber._id, name: barber.name },
      position: newPos,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   ★ AUTO-ASSIGN
═══════════════════════════════════════════════ */
router.post("/queue/:queue_id/auto-assign", protect, async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });
    if (q.barber_id) return res.status(400).json({ success: false, message: "Already assigned. Use reassign instead." });

    const availableBarbers = await Barber.find({
      salon_id:  q.salon_id,
      status:    "available",
      is_active: true,
    });

    if (availableBarbers.length === 0) {
      return res.json({ success: false, message: "No available barbers right now" });
    }

    const barberLoads = await Promise.all(
      availableBarbers.map(async (b) => {
        const load = await Queue.countDocuments({
          barber_id: b._id,
          status:    { $in: ["waiting", "in-progress"] },
        });
        return { barber: b, load };
      })
    );

    barberLoads.sort((a, b) => a.load - b.load);
    const chosen = barberLoads[0].barber;

    const newPos = await Queue.countDocuments({ barber_id: chosen._id, status: "waiting" }) + 1;

    await Queue.findByIdAndUpdate(req.params.queue_id, { barber_id: chosen._id, position: newPos });
    await Booking.findByIdAndUpdate(q.booking_id, { barber_id: chosen._id });

    res.json({
      success: true,
      message: `Auto-assigned to ${chosen.name}`,
      barber: { _id: chosen._id, name: chosen.name },
      position: newPos,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   ★ START SERVICE
═══════════════════════════════════════════════ */
router.put("/queue/:queue_id/start", protect, async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });
    if (!q.barber_id) return res.status(400).json({ success: false, message: "Assign a barber first" });

    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "in-progress" });
    await Booking.findByIdAndUpdate(q.booking_id, { status: "in-progress" });
    await Barber.findByIdAndUpdate(q.barber_id, { status: "busy" });

    res.json({ success: true, message: "Service started" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   ★ COMPLETE SERVICE
═══════════════════════════════════════════════ */
router.put("/queue/:queue_id/complete", protect, async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });

    await Queue.findByIdAndUpdate(req.params.queue_id, {
      status:    "completed",
      served_at: new Date(),
    });
    await Booking.findByIdAndUpdate(q.booking_id, { status: "completed" });

    if (q.barber_id) {
      await Barber.findByIdAndUpdate(q.barber_id, { status: "available" });

      await Queue.updateMany(
        { barber_id: q.barber_id, status: "waiting", position: { $gt: q.position } },
        { $inc: { position: -1 } }
      );
    }

    res.json({ success: true, message: "Service completed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ═══════════════════════════════════════════════
   🚨 TEMPORARY ERROR INTERCEPTOR: OWNER LOGIN
═══════════════════════════════════════════════ */
router.post("/owner/login", async (req, res) => {
  try {
    // This will log exactly what key names are being passed from the frontend form
    console.log("\n====================================");
    console.log("👉 INCOMING LOGIN PAYLOAD:", req.body);
    console.log("====================================\n");

    // Dynamic extraction mechanism to handle phone number vs email input keys
    const { mobileNumber, phone, email, password } = req.body;
    const accountIdentifier = mobileNumber || phone || email;

    if (!accountIdentifier || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Bad Request: Missing login payload. Check your server log terminal!" 
      });
    }

    // Temporary bypass to allow access while debugging frontend schema
    return res.status(200).json({ 
      success: true, 
      message: "Debug payload interceptor successfully executed!",
      token: "mock-jwt-token-bypass"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;