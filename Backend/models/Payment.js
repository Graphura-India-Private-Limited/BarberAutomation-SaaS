const mongoose = require("mongoose");

const normalizeType = value => {
  const next = String(value || "TOKEN").toUpperCase();
  return next === "FULL" ? "FULL" : "TOKEN";
};

const normalizeStatus = value => {
  const next = String(value || "PENDING").toUpperCase();
  if (next === "CAPTURED" || next === "SUCCESS") return "SUCCESS";
  if (next === "FAILED") return "FAILED";
  if (next === "REFUNDED") return "REFUNDED";
  return "PENDING";
};

const paymentSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      alias: "bookingId",
      index: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      alias: "customerId",
      index: true,
    },
    salon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
      alias: "salonId",
      index: true,
    },
    barber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      default: null,
      alias: "barberId",
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    payment_type: {
      type: String,
      enum: ["TOKEN", "FULL"],
      default: "TOKEN",
      set: normalizeType,
      alias: "paymentType",
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
      set: normalizeStatus,
      alias: "paymentStatus",
      index: true,
    },
    razorpay_order_id: {
      type: String,
      default: "",
      alias: "razorpayOrderId",
      index: true,
    },
    razorpay_payment_id: {
      type: String,
      default: "",
      alias: "razorpayPaymentId",
      sparse: true,
      index: true,
    },
    razorpay_signature: {
      type: String,
      default: "",
      alias: "razorpaySignature",
      select: false,
    },
    service_ids: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
      default: [],
      alias: "serviceIds",
    },
    booking_type: {
      type: String,
      enum: ["QUEUE", "SLOT"],
      default: "QUEUE",
      set: value => String(value || "QUEUE").toUpperCase(),
      alias: "bookingType",
      index: true,
    },
    failure_reason: { type: String, default: "", alias: "failureReason" },
    raw_event: { type: Object, default: null, alias: "rawEvent", select: false },
    counter_settled_amount: { type: Number, default: 0 },
    counter_settled_method: { type: String, default: "PENDING" },
    counter_settled_status: { type: String, default: "PENDING" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.index({ salon_id: 1, created_at: -1 });
paymentSchema.index({ salon_id: 1, status: 1, payment_type: 1, created_at: -1 });
paymentSchema.index({ barber_id: 1, created_at: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
