const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Queue = require("../models/Queue");
const Service = require("../models/Service");
const Customer = require("../models/Customer");
const Barber = require("../models/Barber");

// @desc    Create a new booking & add customer to the queue
// @route   POST /api/booking
// @access  Private (Customer/Owner)
exports.createBooking = async (req, res) => {
  try {
    const { salon_id, barber_id, booking_type, services, slot_time, payment_type, attendees, promo_code, customer_name, customer_mobile } = req.body;

    let finalCustomerId = req.body.customer_id || (req.user ? req.user.id : null);

    if (customer_mobile) {
      let customer = await Customer.findOne({ mobile: customer_mobile });
      if (!customer) {
        customer = await Customer.create({
          name: customer_name || "Walk-in Guest",
          mobile: customer_mobile
        });
      } else if (customer_name && customer.name !== customer_name) {
        customer.name = customer_name;
        await customer.save();
      }
      finalCustomerId = customer._id;
    }

    if (!finalCustomerId) {
      return res.status(400).json({ success: false, message: "Customer identification required." });
    }

    if (promo_code === "LOYAL10") {
      const userBookings = await Booking.find({ customer_id: finalCustomerId });
      const activeBookings = userBookings.filter(a =>
        a.status === "Completed" || a.status === "Confirmed" || a.status === "Pending" || a.status === "In-progress" ||
        a.status === "completed" || a.status === "confirmed" || a.status === "pending" || a.status === "in-progress"
      );
      const usedRewardsCount = activeBookings.filter(a => a.promo_code === "LOYAL10").length;
      const paidVisitsCount = activeBookings.filter(a => a.promo_code !== "LOYAL10").length;
      const calculatedUnused = Math.max(0, Math.floor(paidVisitsCount / 10) - usedRewardsCount);
      if (calculatedUnused <= 0) {
        return res.status(400).json({ success: false, message: "You do not have any loyalty rewards available to redeem." });
      }
    } else if (promo_code === "FIRSTCUT20") {
      const userBookings = await Booking.find({ customer_id: finalCustomerId });
      const activeBookings = userBookings.filter(a =>
        a.status === "Completed" || a.status === "Confirmed" || a.status === "Pending" || a.status === "In-progress" ||
        a.status === "completed" || a.status === "confirmed" || a.status === "pending" || a.status === "in-progress"
      );
      if (activeBookings.length > 0) {
        return res.status(400).json({ success: false, message: "FIRSTCUT20 is only valid for your first appointment." });
      }
    }

    let finalBarberId = barber_id || null;
    if (!finalBarberId) {
      const activeBarbers = await Barber.find({ salon_id, is_active: true, status: { $nin: ["break", "offline"] } });
      if (activeBarbers.length > 0) {
        const availableBarber = activeBarbers.find(b => b.status === "available");
        finalBarberId = availableBarber ? availableBarber._id : activeBarbers[0]._id;
      }
    }

    let servicesToProcess = services;
    if (!servicesToProcess || servicesToProcess.length === 0) {
      const salonServices = await Service.find({ salon_id });
      if (salonServices.length > 0) {
        servicesToProcess = [{ service_id: salonServices[0]._id }];
      } else {
        const tempServiceId = new mongoose.Types.ObjectId();
        servicesToProcess = [{ service_id: tempServiceId }];
      }
    }

    if (barber_id) {
      const barber = await Barber.findById(barber_id);
      if (barber && (barber.status === "break" || barber.status === "offline")) {
        return res.status(400).json({
          success: false,
          message: "This stylist is currently on break or offline and cannot accept new bookings."
        });
      }
    }

    const serviceDetails = await Promise.all(
      (servicesToProcess || []).map(async (s) => {
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
      customer_id: finalCustomerId,
      salon_id,
      barber_id: finalBarberId,
      booking_type: booking_type || "queue",
      services: serviceDetails,
      total_amount: total,
      slot_time: slot_time || null,
      status: "confirmed",
      promo_code: promo_code || ""
    });

    const position = await Queue.countDocuments({
      barber_id: finalBarberId,
      salon_id,
      status: { $in: ["waiting", "in-progress"] }
    }) + 1;

    const queue = await Queue.create({
      salon_id,
      barber_id: finalBarberId,
      booking_id: booking._id,
      customer_id: finalCustomerId,
      position,
      estimated_wait: position * 20
    });

    // Create corresponding successful Payment record in DB
    const attendeesCount = attendees && Array.isArray(attendees) ? attendees.length : 1;
    const payType = payment_type === "FULL" ? "FULL" : "TOKEN";
    let payAmount = payType === "FULL" ? total : (attendeesCount * 50);

    if (promo_code === "LOYAL10") {
      payAmount = Math.max(0, Math.round(payAmount * 0.9));
    } else if (promo_code === "FIRSTCUT20") {
      payAmount = Math.max(0, Math.round(payAmount * 0.8));
    }

    const Payment = require("../models/Payment");
    const payment = await Payment.create({
      booking_id: booking._id,
      customer_id: finalCustomerId,
      salon_id,
      barber_id: finalBarberId,
      amount: payAmount,
      payment_type: payType,
      status: "SUCCESS"
    });

    res.status(201).json({ success: true, booking, queue, payment });
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
      .populate("customer_id", "name mobile email")
      .populate("barber_id", "name")
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

// @desc    Get refund estimation details for a booking
// @route   GET /api/booking/:id/refund-estimation
// @access  Private
exports.getRefundEstimation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer_id", "name mobile email")
      .populate("salon_id", "salon_name address");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Find the successful payment associated with this booking
    const Payment = require("../models/Payment");
    let payment = await Payment.findOne({ booking_id: booking._id, status: "SUCCESS" });

    let amountPaid = 0;
    let paymentType = "NONE";
    let refundAmount = 0;
    let bookingCharges = 50; // Default flat cancellation fee in INR

    if (payment) {
      amountPaid = payment.amount;
      paymentType = payment.payment_type; // "TOKEN" or "FULL"
    } else {
      // Fallback for bookings without payment documents in DB (e.g., test/mock data)
      amountPaid = booking.total_amount || 0;
      // If amount is small (e.g. <= 100), assume it was a token payment. Else full payment.
      paymentType = amountPaid <= 100 ? "TOKEN" : "FULL";
    }

    if (paymentType === "FULL") {
      bookingCharges = 50;
      refundAmount = 0; // Disable refund
    } else {
      // For token payment, the charge is the entire paid token amount, so refund is 0
      bookingCharges = amountPaid;
      refundAmount = 0;
    }

    res.json({
      success: true,
      booking,
      payment: {
        amount: amountPaid,
        payment_type: paymentType,
        status: payment ? payment.status : "SUCCESS",
        created_at: payment ? payment.created_at : booking.created_at
      },
      refundRules: {
        bookingCharges,
        refundAmount: 0,
        refundable: false,
        policyNote: "Once booked, bookings are non-refundable as per salon cancellation policy."
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Process cancellation and refund for a booking
// @route   POST /api/booking/:id/cancel-with-refund
// @access  Private
exports.cancelWithRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    // Find payment
    const Payment = require("../models/Payment");
    let payment = await Payment.findOne({ booking_id: booking._id, status: "SUCCESS" });

    let refundAmount = 0;
    let paymentType = "NONE";

    if (payment) {
      paymentType = payment.payment_type;
      // Payments are non-refundable now. We do not set payment.status to 'REFUNDED' nor call Razorpay refund.
    } else {
      // Fallback
      const amountPaid = booking.total_amount || 0;
      paymentType = amountPaid <= 100 ? "TOKEN" : "FULL";
    }

    // Cancel booking status
    booking.status = "cancelled";
    await booking.save();

    // Delete queue entry if any
    await Queue.deleteOne({ booking_id: req.params.id });

    res.json({
      success: true,
      message: "Booking successfully cancelled. No refund is applicable as per salon cancellation policy.",
      refundAmount: 0,
      bookingStatus: booking.status,
      paymentStatus: payment ? payment.status : "NONE"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

