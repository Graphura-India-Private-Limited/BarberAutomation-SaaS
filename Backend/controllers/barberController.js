const bcrypt = require("bcryptjs");
const Barber = require("../models/Barber");
const Queue = require("../models/Queue");
const Booking = require("../models/Booking");
const BreakRequest = require("../models/BreakRequest");
const Payment = require("../models/Payment");

// @desc    Get all active barbers of a salon
// @route   GET /api/barber/salon/:salon_id
// @access  Public
exports.getBarbersBySalon = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const barbersList = await Barber.find({ salon_id: req.params.salon_id, is_active: true });

    // Sync barber status based on active in-progress queue entries today
    const barbers = await Promise.all(
      barbersList.map(async (barber) => {
        const hasInProgress = await Queue.findOne({
          barber_id: barber._id,
          status: "in-progress",
          joined_at: { $gte: today }
        });
        if (hasInProgress) {
          if (barber.status !== "busy") {
            barber.status = "busy";
            await Barber.findByIdAndUpdate(barber._id, { status: "busy" });
          }
        } else {
          if (barber.status === "busy") {
            barber.status = "available";
            await Barber.findByIdAndUpdate(barber._id, { status: "available" });
          }
        }

        const queueCount = await Queue.countDocuments({
          barber_id: barber._id,
          status: { $in: ["waiting", "in-progress"] },
          joined_at: { $gte: today }
        });

        const barberObj = barber.toObject();
        barberObj.queue_count = queueCount;
        return barberObj;
      })
    );

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
    const { 
      salon_id, 
      name, 
      mobile, 
      password, 
      specialization, 
      experience,
      email,
      aadhaar,
      pan,
      photo,
      document,
      documentName
    } = req.body;
    const exists = await Barber.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ success: false, message: "Mobile exists" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({ 
      salon_id, 
      name, 
      mobile, 
      password_hash, 
      specialization, 
      experience,
      email,
      aadhaar,
      pan,
      photo,
      document,
      documentName
    });
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
    if (!["available", "break", "busy"].includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status value: ${status}` });
    }
    await Barber.findByIdAndUpdate(req.params.id, { status });

    if (status === "break") {
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
    const barber = await Barber.findById(req.params.id).populate("salon_id", "salon_name address support_number salary_model");
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

    // 1. Calculate today's revenue from successful payments
    const todayPayments = await Payment.find({
      barber_id: req.params.id,
      status: "SUCCESS",
      created_at: { $gte: today }
    });
    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    // 2. Calculate weekly revenue (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekPayments = await Payment.find({
      barber_id: req.params.id,
      status: "SUCCESS",
      created_at: { $gte: oneWeekAgo }
    });
    const weekRevenue = weekPayments.reduce((sum, p) => sum + p.amount, 0);

    // 3. Calculate active/total barbers for the salon
    const totalBarbers = await Barber.countDocuments({ salon_id: barber.salon_id, is_active: true });
    const onlineBarbers = await Barber.countDocuments({ salon_id: barber.salon_id, is_active: true, status: { $ne: "break" } });
    const activeBarbers = `${onlineBarbers}/${totalBarbers}`;

    // 4. Calculate live queue count (waiting + in-progress today)
    const liveQueue = await Queue.countDocuments({
      barber_id: req.params.id,
      status: { $in: ["waiting", "in-progress"] },
      joined_at: { $gte: today }
    });

    // 5. Average wait calculation
    const avgWait = liveQueue * 20;

    // 6. Calculate weekly chart revenue breakdown for the last 7 days (Mon-Sun or relative)
    const weekData = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayPayments = await Payment.find({
        barber_id: req.params.id,
        status: "SUCCESS",
        created_at: { $gte: d, $lt: nextD }
      });
      const dayVal = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      weekData.push({
        day: dayNames[d.getDay()],
        val: dayVal,
        current: i === 0
      });
    }

    res.json({
      success: true,
      barber,
      todayQueue,
      stats: {
        completedToday,
        totalServed,
        rating: barber.rating || 5.0,
        todayRevenue,
        weekRevenue,
        activeBarbers,
        liveQueue,
        avgWait,
        weekData
      }
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
    const q = await Queue.findById(req.params.queue_id);
    if (!q) return res.status(404).json({ success: false, message: "Queue entry not found" });

    // Validate that the barber is not already attending another customer
    const activeService = await Queue.findOne({
      barber_id: req.params.barber_id,
      status: "in-progress",
      _id: { $ne: q._id }
    });
    if (activeService) {
      return res.status(400).json({ success: false, message: "Barber is already attending another customer" });
    }

    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "in-progress" });
    await Barber.findByIdAndUpdate(req.params.barber_id, { status: "busy" });
    if (q.booking_id) {
      await Booking.findByIdAndUpdate(q.booking_id, { status: "in-progress" });
    }

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
    if (q && q.booking_id) {
      await Booking.findByIdAndUpdate(q.booking_id, { status: "completed" });
    }
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
    if (q && q.booking_id) {
      await Booking.findByIdAndUpdate(q.booking_id, { status: "noshow" });
    }
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

    const breakReq = await BreakRequest.create({
      barber_id: req.params.id,
      break_type: break_type || "short",
      start_time: start_time || new Date(),
      duration_mins: duration_mins || 15,
      reason: reason || "",
      status: "pending"
    });

    res.json({ success: true, break: breakReq, autoApproved: false });
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

exports.updateBarberProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    const barber = await Barber.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

// @desc    Get break requests for a specific barber
// @route   GET /api/barber/:id/breaks
// @access  Private (Barber/Owner/Admin)
exports.getBarberBreaks = async (req, res) => {
  try {
    const requests = await BreakRequest.find({ barber_id: req.params.id })
      .populate("barber_id", "name mobile")
      .sort({ created_at: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
