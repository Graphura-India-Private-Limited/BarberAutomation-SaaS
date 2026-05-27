const bcrypt = require("bcryptjs");
const Barber = require("../models/Barber");
const Queue = require("../models/Queue");
const Booking = require("../models/Booking");
const BreakRequest = require("../models/BreakRequest");

// @desc    Get all active barbers of a salon
// @route   GET /api/barber/salon/:salon_id
// @access  Public
exports.getBarbersBySalon = async (req, res) => {
  try {
    const barbers = await Barber.find({ salon_id: req.params.salon_id, is_active: true });
    res.json({ success: true, barbers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register a new barber profile
// @route   POST /api/barber
// @access  Private (Owner/Admin)
exports.createBarber = async (req, res) => {
  try {
    const { salon_id, name, mobile, password, specialization, experience } = req.body;
    const exists = await Barber.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ success: false, message: "Mobile exists" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({ salon_id, name, mobile, password_hash, specialization, experience });
    res.status(201).json({ success: true, barber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update barber status (and handle wait queue updates accordingly)
// @route   PUT /api/barber/:id/status
// @access  Private (Barber/Owner)
exports.updateBarberStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Barber.findByIdAndUpdate(req.params.id, { status });

    if (status === "break" || status === "offline") {
      await Queue.updateMany({ barber_id: req.params.id, status: "waiting" }, { status: "paused" });
    }
    if (status === "available") {
      await Queue.updateMany({ barber_id: req.params.id, status: "paused" }, { status: "waiting" });
    }

    res.json({ success: true, message: `Status: ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get barber dashboard statistics and current queue
// @route   GET /api/barber/:id/dashboard
// @access  Private (Barber)
exports.getBarberDashboard = async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).populate("salon_id", "salon_name address");
    if (!barber) return res.status(404).json({ success: false, message: "Not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayQueue = await Queue.find({
      barber_id: req.params.id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] },
      joined_at: { $gte: today }
    })
      .populate("customer_id", "name mobile")
      .populate("booking_id", "booking_type total_amount services")
      .sort({ position: 1 });

    const completedToday = await Queue.countDocuments({ barber_id: req.params.id, status: "completed", joined_at: { $gte: today } });
    const totalServed = await Queue.countDocuments({ barber_id: req.params.id, status: "completed" });

    res.json({
      success: true,
      barber,
      todayQueue,
      stats: { completedToday, totalServed, rating: barber.rating }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Start service for a queue entry
// @route   PUT /api/barber/:barber_id/queue/:queue_id/start
// @access  Private (Barber)
exports.startService = async (req, res) => {
  try {
    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "in-progress" });
    await Barber.findByIdAndUpdate(req.params.barber_id, { status: "busy" });
    const q = await Queue.findById(req.params.queue_id);
    await Booking.findByIdAndUpdate(q.booking_id, { status: "in-progress" });

    res.json({ success: true, message: "Service started!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Complete service for a queue entry
// @route   PUT /api/barber/:barber_id/queue/:queue_id/complete
// @access  Private (Barber)
exports.completeService = async (req, res) => {
  try {
    const q = await Queue.findByIdAndUpdate(req.params.queue_id, { status: "completed", served_at: new Date() }, { new: true });
    await Barber.findByIdAndUpdate(req.params.barber_id, { status: "available" });
    await Booking.findByIdAndUpdate(q.booking_id, { status: "completed" });
    await Queue.updateMany(
      { barber_id: req.params.barber_id, status: "waiting", position: { $gt: q.position } },
      { $inc: { position: -1 } }
    );

    res.json({ success: true, message: "Service completed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark a queue entry customer as no-show
// @route   PUT /api/barber/:barber_id/queue/:queue_id/noshow
// @access  Private (Barber)
exports.markNoShow = async (req, res) => {
  try {
    const q = await Queue.findByIdAndUpdate(req.params.queue_id, { status: "noshow" }, { new: true });
    await Booking.findByIdAndUpdate(q.booking_id, { status: "noshow" });
    await Barber.findByIdAndUpdate(req.params.barber_id, { status: "available" });
    await Queue.updateMany(
      { barber_id: req.params.barber_id, status: "waiting", position: { $gt: q.position } },
      { $inc: { position: -1 } }
    );

    res.json({ success: true, message: "No-show marked" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit a break request
// @route   POST /api/barber/:id/break-request
// @access  Private (Barber)
exports.submitBreakRequest = async (req, res) => {
  try {
    const { break_type, start_time, duration_mins, reason } = req.body;
    const autoApprove = break_type === "short" || Number(duration_mins) < 30;

    const breakReq = await BreakRequest.create({
      barber_id: req.params.id,
      break_type: break_type || "short",
      start_time: start_time || new Date(),
      duration_mins: duration_mins || 15,
      reason: reason || "",
      status: autoApprove ? "approved" : "pending"
    });

    if (autoApprove) {
      await Barber.findByIdAndUpdate(req.params.id, { status: "break" });
    }

    res.json({ success: true, break: breakReq, autoApproved: autoApprove });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    End active approved break
// @route   PUT /api/barber/:id/break-end
// @access  Private (Barber)
exports.endBreak = async (req, res) => {
  try {
    await Barber.findByIdAndUpdate(req.params.id, { status: "available" });
    await BreakRequest.findOneAndUpdate(
      { barber_id: req.params.id, status: "approved", end_time: null },
      { status: "ended", end_time: new Date() }
    );
    await Queue.updateMany({ barber_id: req.params.id, status: "paused" }, { status: "waiting" });

    res.json({ success: true, message: "Break ended!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update barber profile info
// @route   PUT /api/barber/:id
// @access  Private (Barber/Owner/Admin)
exports.updateBarberProfile = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, barber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Deactivate barber account (soft delete)
// @route   DELETE /api/barber/:id
// @access  Private (Owner/Admin)
exports.deactivateBarber = async (req, res) => {
  try {
    await Barber.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
