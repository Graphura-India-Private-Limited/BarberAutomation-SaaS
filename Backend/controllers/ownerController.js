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

    const barbersList = await Barber.find({ salon_id: req.params.salon_id, is_active: true })
      .select("-password_hash -document -photo");

    // Fetch all in-progress queue entries for this salon today in a single query
    const activeQueues = await Queue.find({
      salon_id: req.params.salon_id,
      status: "in-progress",
      joined_at: { $gte: today }
    });
    const busyBarberIds = new Set(activeQueues.map(q => q.barber_id.toString()));

    // Sync barber status based on active in-progress queue entries today
    const barbers = await Promise.all(
      barbersList.map(async (barber) => {
        const isBusy = busyBarberIds.has(barber._id.toString());
        const targetStatus = isBusy ? "busy" : (barber.status === "busy" ? "available" : barber.status);
        if (barber.status !== targetStatus) {
          barber.status = targetStatus;
          await Barber.findByIdAndUpdate(barber._id, { status: targetStatus });
        }
        return barber;
      })
    );

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
    if (q.booking_id) {
      const Payment = require("../models/Payment");
      await Payment.updateMany({ booking_id: q.booking_id }, { barber_id: new_barber_id });
    }

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
    if (q.booking_id) {
      const Payment = require("../models/Payment");
      await Payment.updateMany({ booking_id: q.booking_id }, { barber_id });
    }

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
    if (q.booking_id) {
      const Payment = require("../models/Payment");
      await Payment.updateMany({ booking_id: q.booking_id }, { barber_id: chosen._id });
    }

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

    // Validate that the barber is not already attending another customer
    const activeService = await Queue.findOne({
      barber_id: q.barber_id,
      status: "in-progress",
      _id: { $ne: q._id }
    });
    if (activeService) {
      return res.status(400).json({ success: false, message: "Barber is already attending another customer" });
    }

    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "in-progress", served_at: new Date() });
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
      await Booking.findByIdAndUpdate(q.booking_id, { status: "completed", barber_id: q.barber_id });
      if (q.barber_id) {
        const Payment = require("../models/Payment");
        await Payment.updateMany({ booking_id: q.booking_id }, { barber_id: q.barber_id });
      }
    }

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
