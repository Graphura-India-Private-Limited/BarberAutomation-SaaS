const Booking = require("../models/Booking");
const Queue = require("../models/Queue");
const Service = require("../models/Service");

// @desc    Create a new booking & add customer to the queue
// @route   POST /api/booking
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const { salon_id, barber_id, booking_type, services, slot_time } = req.body;

    const serviceDetails = await Promise.all(
      (services || []).map(async (s) => {
        const svc = await Service.findById(s.service_id);
        return {
          service_id: s.service_id,
          service_name: svc?.name || "Service",
          price: svc?.price || 0,
          member_name: s.member_name || "Self"
        };
      })
    );

    const total = serviceDetails.reduce((sum, s) => sum + s.price, 0);

    if (booking_type === "slot" && slot_time) {
      const slotDate = new Date(slot_time);
      if (isNaN(slotDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid slot time format." });
      }

      const now = new Date();
      const istTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const nowIST = new Date(istTimeStr);

      const slotUTC = Date.UTC(
        slotDate.getUTCFullYear(),
        slotDate.getUTCMonth(),
        slotDate.getUTCDate(),
        slotDate.getUTCHours(),
        slotDate.getUTCMinutes()
      );

      const nowLocalComponents = Date.UTC(
        nowIST.getFullYear(),
        nowIST.getMonth(),
        nowIST.getDate(),
        nowIST.getHours(),
        nowIST.getMinutes()
      );

      if (slotUTC < nowLocalComponents) {
        return res.status(400).json({ success: false, message: "Cannot book a slot in the past." });
      }
    }

    const booking = await Booking.create({
      customer_id: req.user.id,
      salon_id,
      barber_id: barber_id || null,
      booking_type: booking_type || "queue",
      services: serviceDetails,
      total_amount: total,
      slot_time: slot_time || null
    });

    const position = await Queue.countDocuments({
      barber_id: barber_id || null,
      salon_id,
      status: { $in: ["waiting", "in-progress"] }
    }) + 1;

    const queue = await Queue.create({
      salon_id,
      barber_id: barber_id || null,
      booking_id: booking._id,
      customer_id: req.user.id,
      position,
      estimated_wait: position * 20
    });

    res.status(201).json({ success: true, booking, queue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get customer's own bookings
// @route   GET /api/booking/my
// @access  Private (Customer)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.user.id })
      .populate("salon_id", "salon_name address")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get bookings of a specific salon
// @route   GET /api/booking/salon/:id
// @access  Private (Owner/Admin)
exports.getSalonBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ salon_id: req.params.id })
      .populate("customer_id", "name mobile")
      .sort({ created_at: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/booking/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/booking/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    await Queue.deleteOne({ booking_id: req.params.id });

    res.json({ success: true, message: "Cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
