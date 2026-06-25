const Salon = require("../models/Salon");
const Barber = require("../models/Barber");
const Booking = require("../models/Booking");
const Queue = require("../models/Queue");
const BreakRequest = require("../models/BreakRequest");
const ApprovalRequest = require("../models/ApprovalRequest");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// @desc    Get owner dashboard statistics for a specific salon
// @route   GET /api/owner/salon/:salon_id/dashboard
// @access  Private (Owner)
exports.getOwnerDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const barbers = await Barber.find({ salon_id: req.params.salon_id, is_active: true });

    const [pending, completed, liveQ, pendingBreaks] = await Promise.all([
      Booking.countDocuments({ salon_id: req.params.salon_id, status: "pending", created_at: { $gte: today } }),
      Booking.countDocuments({ salon_id: req.params.salon_id, status: "completed", created_at: { $gte: today } }),
      Queue.countDocuments({ salon_id: req.params.salon_id, status: { $in: ["waiting", "in-progress"] } }),
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
};

// @desc    Get break requests for a specific salon
// @route   GET /api/owner/salon/:salon_id/break-requests
// @access  Private (Owner)
exports.getBreakRequests = async (req, res) => {
  try {
    const barbers = await Barber.find({ salon_id: req.params.salon_id }, "_id");
    const ids = barbers.map(b => b._id);
    const requests = await BreakRequest.find({ barber_id: { $in: ids } })
      .populate("barber_id", "name mobile")
      .sort({ created_at: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve/Reject break request (Alternative route)
// @route   PUT /api/owner/break-request/:id
// @access  Private (Owner)
exports.handleBreakRequestAction = async (req, res) => {
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
};

// @desc    Reassign customer queue entry to a different barber
// @route   PUT /api/owner/queue/:queue_id/reassign
// @access  Private (Owner)
exports.reassignQueueEntry = async (req, res) => {
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
};

// @desc    Manually assign a customer queue entry to a barber
// @route   POST /api/owner/queue/:queue_id/assign
// @access  Private (Owner)
exports.manualAssignQueueEntry = async (req, res) => {
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
};

// @desc    Auto-assign customer queue entry to the available barber with lowest load
// @route   POST /api/owner/queue/:queue_id/auto-assign
// @access  Private (Owner)
exports.autoAssignQueueEntry = async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });
    if (q.barber_id) return res.status(400).json({ success: false, message: "Already assigned. Use reassign instead." });

    const availableBarbers = await Barber.find({
      salon_id: q.salon_id,
      status: "available",
      is_active: true,
    });

    if (availableBarbers.length === 0) {
      return res.json({ success: false, message: "No available barbers right now" });
    }

    const barberLoads = await Promise.all(
      availableBarbers.map(async (b) => {
        const load = await Queue.countDocuments({
          barber_id: b._id,
          status: { $in: ["waiting", "in-progress"] },
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
};

// @desc    Start service for a customer queue entry
// @route   PUT /api/owner/queue/:queue_id/start
// @access  Private (Owner)
exports.startService = async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });
    if (!q.barber_id) return res.status(400).json({ success: false, message: "Assign a barber first" });

    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "in-progress" });
    if (q.booking_id) {
      await Booking.findByIdAndUpdate(q.booking_id, { status: "in-progress" });
    }
    if (q.barber_id) {
      await Barber.findByIdAndUpdate(q.barber_id, { status: "busy" });
    }

    res.json({ success: true, message: "Service started" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Helper to seed one mock unassigned queue entry
const seedOneMockUnassigned = async (salon_id) => {
  try {
    const mockNames = ["Rohit Sharma", "Kabir Dev", "Rohan Das", "Vikram Sen", "Aarav Mehta", "Priya Patil", "Amit Joshi", "Sneha Kulkarni"];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomMobile = "9" + Math.floor(100000000 + Math.random() * 900000000);

    let customer = await Customer.findOne({ mobile: randomMobile });
    if (!customer) {
      customer = await Customer.create({
        name: randomName,
        mobile: randomMobile
      });
    }

    const servicesList = [
      { name: "Classic Haircut", price: 300 },
      { name: "Taper Fade & Trim", price: 350 },
      { name: "Beard Sculpting & Oil", price: 200 },
      { name: "Royal Head Massage", price: 250 },
      { name: "Charcoal Face Mask", price: 300 }
    ];
    const randomService = servicesList[Math.floor(Math.random() * servicesList.length)];

    const booking = await Booking.create({
      customer_id: customer._id,
      salon_id,
      barber_id: null,
      booking_type: "queue",
      services: [{ service_id: new mongoose.Types.ObjectId(), service_name: randomService.name, price: randomService.price }],
      total_amount: randomService.price,
      status: "confirmed"
    });

    const position = await Queue.countDocuments({
      salon_id,
      status: { $in: ["waiting", "in-progress"] }
    }) + 1;

    await Queue.create({
      salon_id,
      barber_id: null,
      booking_id: booking._id,
      customer_id: customer._id,
      position,
      status: "waiting",
      estimated_wait: position * 20
    });
    console.log(`Auto-seeded one mock unassigned customer: ${randomName}`);
  } catch (err) {
    console.error("Error seeding mock unassigned:", err);
  }
};

// @desc    Helper to seed mock unassigned entries if count is less than 3
const seedMockUnassignedIfNeeded = async (salon_id) => {
  try {
    const unassignedCount = await Queue.countDocuments({
      salon_id,
      barber_id: null,
      status: "waiting"
    });
    const needed = Math.max(0, 3 - unassignedCount);
    for (let i = 0; i < needed; i++) {
      await seedOneMockUnassigned(salon_id);
    }
  } catch (err) {
    console.error("Error ensuring mock unassigned count:", err);
  }
};

// @desc    Complete service for a customer queue entry
// @route   PUT /api/owner/queue/:queue_id/complete
// @access  Private (Owner)
exports.completeService = async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });

    await Queue.findByIdAndUpdate(req.params.queue_id, {
      status: "completed",
      served_at: new Date(),
    });
    if (q.booking_id) {
      await Booking.findByIdAndUpdate(q.booking_id, { status: "completed" });
    }

    if (q.barber_id) {
      await Barber.findByIdAndUpdate(q.barber_id, { status: "available" });

      await Queue.updateMany(
        { barber_id: q.barber_id, status: "waiting", position: { $gt: q.position } },
        { $inc: { position: -1 } }
      );
    }

    // Auto-seed mock unassigned entries so owner dashboard remains populated
    await seedMockUnassignedIfNeeded(q.salon_id);

    res.json({ success: true, message: "Service completed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Temporary Debug Bypass for Owner Login
// @route   POST /api/owner/owner/login
// @access  Public (Debug only)
exports.debugOwnerLoginBypass = async (req, res) => {
  try {
    console.log("\n====================================");
    console.log("👉 INCOMING LOGIN PAYLOAD:", req.body);
    console.log("====================================\n");

    const { mobileNumber, phone, email, password } = req.body;
    const accountIdentifier = mobileNumber || phone || email;

    if (!accountIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing login payload. Check your server log terminal!"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Debug payload interceptor successfully executed!",
      token: "mock-jwt-token-bypass"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get approval requests for a specific salon
// @route   GET /api/owner/salon/:salon_id/approval-requests
// @access  Private (Owner)
exports.getSalonApprovalRequests = async (req, res) => {
  try {
    const requests = await ApprovalRequest.find({ salon_id: req.params.salon_id }).sort({ created_at: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
