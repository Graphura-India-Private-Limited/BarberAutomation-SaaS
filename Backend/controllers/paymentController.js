const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const razorpayService = require("../services/razorpayService");

const ownerSalonFilter = req => (req.user?.role === "owner" ? { salon_id: req.user._id } : {});

const parseDateRange = query => {
  const range = {};
  if (query.from) range.$gte = new Date(query.from);
  if (query.to) {
    const end = new Date(query.to);
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }
  return Object.keys(range).length ? range : null;
};

const buildPaymentFilter = req => {
  const filter = { ...ownerSalonFilter(req) };
  const { paymentType, status, barberId, salonId, date, from, to, q } = req.query;

  if (paymentType && paymentType !== "ALL") filter.payment_type = String(paymentType).toUpperCase();
  if (status && status !== "ALL") filter.status = String(status).toUpperCase();
  if (barberId && mongoose.isValidObjectId(barberId)) filter.barber_id = barberId;
  if (salonId && mongoose.isValidObjectId(salonId) && req.user?.role !== "owner") filter.salon_id = salonId;

  const range = date ? parseDateRange({ from: date, to: date }) : parseDateRange({ from, to });
  if (range) filter.created_at = range;

  if (q && mongoose.isValidObjectId(q)) {
    filter.$or = [{ booking_id: q }, { customer_id: q }, { razorpay_order_id: q }, { razorpay_payment_id: q }];
  } else if (q) {
    filter.$or = [
      { razorpay_order_id: { $regex: q, $options: "i" } },
      { razorpay_payment_id: { $regex: q, $options: "i" } },
    ];
  }

  return filter;
};

const populatePayment = query =>
  query
    .populate("booking_id", "booking_type status total_amount services slot_time")
    .populate("customer_id", "name mobile email")
    .populate("salon_id", "salon_name owner_name")
    .populate("barber_id", "name mobile specialization")
    .populate("service_ids", "name price category");

const listPayments = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const filter = buildPaymentFilter(req);

  const [payments, total] = await Promise.all([
    populatePayment(Payment.find(filter)).sort({ created_at: -1 }).skip(skip).limit(limit),
    Payment.countDocuments(filter),
  ]);

  res.json({
    success: true,
    payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const bookingId = req.body.bookingId || req.body.booking_id;
  const paymentType = String(req.body.paymentType || req.body.payment_type || "TOKEN").toUpperCase();
  const requestedAmount = Number(req.body.amount);

  if (!mongoose.isValidObjectId(bookingId)) throw new ApiError(400, "Valid bookingId is required");
  if (!["TOKEN", "FULL"].includes(paymentType)) throw new ApiError(400, "paymentType must be TOKEN or FULL");

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (req.user?.role === "customer" && String(booking.customer_id) !== String(req.user._id)) {
    throw new ApiError(403, "You can only pay for your own booking");
  }

  const amount = requestedAmount > 0 ? requestedAmount : Number(booking.total_amount || 0);
  if (amount <= 0) throw new ApiError(400, "Payment amount must be greater than zero");

  const order = await razorpayService.createOrder({
    amount,
    receipt: `bkg_${booking._id}_${Date.now()}`.slice(0, 40),
    notes: {
      bookingId: String(booking._id),
      salonId: String(booking.salon_id),
      customerId: String(booking.customer_id),
      paymentType,
    },
  });

  const payment = await Payment.create({
    bookingId: booking._id,
    customerId: booking.customer_id,
    salonId: booking.salon_id,
    barberId: booking.barber_id || null,
    amount,
    paymentType,
    paymentStatus: "PENDING",
    razorpayOrderId: order.id,
    serviceIds: (booking.services || []).map(item => item.service_id).filter(Boolean),
    bookingType: booking.booking_type,
    counter_settled_amount: 0,
    counter_settled_method: paymentType === "FULL" ? "ONLINE" : "PENDING",
    counter_settled_status: paymentType === "FULL" ? "SETTLED" : "PENDING",
  });

  res.status(201).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
    order,
    payment,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const razorpayOrderId = req.body.razorpayOrderId || req.body.razorpay_order_id;
  const razorpayPaymentId = req.body.razorpayPaymentId || req.body.razorpay_payment_id;
  const razorpaySignature = req.body.razorpaySignature || req.body.razorpay_signature;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, "Razorpay order, payment and signature are required");
  }

  const payment = await Payment.findOne({ razorpay_order_id: razorpayOrderId }).select("+razorpay_signature");
  if (!payment) throw new ApiError(404, "Payment order not found");
  if (payment.status === "SUCCESS") {
    return res.json({ success: true, message: "Payment was already verified", payment });
  }
  const duplicate = await Payment.findOne({
    razorpay_payment_id: razorpayPaymentId,
    _id: { $ne: payment._id },
  });
  if (duplicate) throw new ApiError(409, "This Razorpay payment was already used");

  payment.paymentStatus = "SUCCESS";
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  if (payment.payment_type === "FULL") {
    payment.counter_settled_status = "SETTLED";
    payment.counter_settled_method = "ONLINE";
  }
  await payment.save();
  await Booking.findByIdAndUpdate(payment.booking_id, { status: "confirmed" });

  res.json({ success: true, message: "Payment verified", payment });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...ownerSalonFilter(req) };
  const payment = await populatePayment(Payment.findOne(filter));
  if (!payment) throw new ApiError(404, "Payment not found");
  res.json({ success: true, payment });
});

const getTokenPayments = (req, res, next) => {
  req.query.paymentType = "TOKEN";
  return listPayments(req, res, next);
};

const getFullPayments = (req, res, next) => {
  req.query.paymentType = "FULL";
  return listPayments(req, res, next);
};

const getPendingPayments = (req, res, next) => {
  req.query.status = "PENDING";
  return listPayments(req, res, next);
};

const getPaymentsBySalon = (req, res, next) => {
  req.query.salonId = req.params.salonId;
  return listPayments(req, res, next);
};

const getPaymentsByBarber = (req, res, next) => {
  req.query.barberId = req.params.barberId;
  return listPayments(req, res, next);
};

const getPaymentsByDateRange = (req, res, next) => listPayments(req, res, next);

const markFailedPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, ...ownerSalonFilter(req), status: { $ne: "SUCCESS" } },
    { status: "FAILED", failure_reason: req.body.failureReason || req.body.failure_reason || "Payment failed" },
    { new: true }
  );
  if (!payment) throw new ApiError(404, "Pending payment not found");
  res.json({ success: true, payment });
});

const retryFailedPayment = asyncHandler(async (req, res) => {
  const oldPayment = await Payment.findOne({ _id: req.params.id, ...ownerSalonFilter(req) });
  if (!oldPayment) throw new ApiError(404, "Payment not found");
  if (oldPayment.status !== "FAILED") throw new ApiError(400, "Only failed payments can be retried");

  req.body.bookingId = oldPayment.booking_id;
  req.body.amount = oldPayment.amount;
  req.body.paymentType = oldPayment.payment_type;
  return createRazorpayOrder(req, res);
});

const handleWebhook = asyncHandler(async (req, res) => {
  const event = req.razorpayEvent || (Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf8")) : req.body);
  const entity = event?.payload?.payment?.entity || event?.payload?.order?.entity || {};
  const orderId = entity.order_id || entity.id;

  if (!orderId) return res.json({ success: true, message: "Webhook ignored" });

  const update = { raw_event: event };
  if (event.event === "payment.captured" || event.event === "order.paid") {
    update.status = "SUCCESS";
    if (entity.id && entity.order_id) update.razorpay_payment_id = entity.id;
    const existingPayment = await Payment.findOne({ razorpay_order_id: orderId });
    if (existingPayment && existingPayment.payment_type === "FULL") {
      update.counter_settled_status = "SETTLED";
      update.counter_settled_method = "ONLINE";
    }
  } else if (event.event === "payment.failed") {
    update.status = "FAILED";
    update.failure_reason = entity.error_description || entity.error_reason || "Razorpay payment failed";
  }

  const payment = await Payment.findOneAndUpdate({ razorpay_order_id: orderId }, update, { new: true });
  if (payment?.status === "SUCCESS") {
    await Booking.findByIdAndUpdate(payment.booking_id, { status: "confirmed" });
  }

  res.json({ success: true });
});

const refundPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ _id: req.body.paymentId || req.body.payment_id, ...ownerSalonFilter(req) });
  if (!payment) throw new ApiError(404, "Payment not found");
  if (!payment.razorpay_payment_id) throw new ApiError(400, "Payment does not have a Razorpay payment id");

  await razorpayService.refundPayment({ paymentId: payment.razorpay_payment_id, amount: payment.amount });
  payment.status = "REFUNDED";
  await payment.save();
  res.json({ success: true, message: "Refund initiated", payment });
});

const getOwnerSettlements = asyncHandler(async (req, res) => {
  if (req.user?.role !== "owner") {
    throw new ApiError(403, "Owner access only");
  }
  const salonId = req.user._id;

  const payments = await Payment.find({ salon_id: salonId, status: "SUCCESS" })
    .populate("booking_id")
    .populate("customer_id", "name mobile")
    .populate("barber_id", "name")
    .sort({ created_at: -1 });

  const completedPayments = payments.filter(p => p.booking_id && p.booking_id.status?.toLowerCase() === "completed");

  const settlements = completedPayments.map(p => {
    const isFull = p.payment_type === "FULL";
    return {
      id: p._id,
      customerName: p.customer_id?.name || "Walk-in Customer",
      mobile: p.customer_id?.mobile || "N/A",
      services: (p.booking_id.services || []).map(s => s.service_name).join(", "),
      barberName: p.barber_id ? p.barber_id.name : "Unassigned",
      totalAmount: p.booking_id.total_amount,
      tokenPaid: p.amount,
      balancePaid: isFull ? 0 : p.counter_settled_amount,
      method: isFull ? "ONLINE" : p.counter_settled_method,
      status: isFull ? "SETTLED" : p.counter_settled_status,
      timestamp: new Date(p.created_at || p.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };
  });

  res.json({ success: true, settlements });
});

const settleCounterDues = asyncHandler(async (req, res) => {
  if (req.user?.role !== "owner") {
    throw new ApiError(403, "Owner access only");
  }
  const { method } = req.body;
  if (!["CASH", "UPI (SALON QR)", "CARD (SALON POS)"].includes(method)) {
    throw new ApiError(400, "Invalid payment method");
  }

  const payment = await Payment.findOne({ _id: req.params.id, salon_id: req.user._id });
  if (!payment) throw new ApiError(404, "Payment transaction not found");

  if (payment.payment_type !== "TOKEN") {
    throw new ApiError(400, "Only token payments need counter settlement");
  }

  const booking = await Booking.findById(payment.booking_id);
  if (!booking) throw new ApiError(404, "Associated booking not found");

  const due = booking.total_amount - payment.amount;

  payment.counter_settled_amount = due;
  payment.counter_settled_method = method;
  payment.counter_settled_status = "SETTLED";
  await payment.save();

  res.json({
    success: true,
    message: "Counter dues settled successfully",
    payment
  });
});

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  listPayments,
  getTokenPayments,
  getFullPayments,
  getPendingPayments,
  getPaymentById,
  getPaymentsBySalon,
  getPaymentsByBarber,
  getPaymentsByDateRange,
  markFailedPayment,
  retryFailedPayment,
  handleWebhook,
  refundPayment,
  getOwnerSettlements,
  settleCounterDues,
};
