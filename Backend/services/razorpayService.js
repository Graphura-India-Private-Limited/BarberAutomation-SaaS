const crypto = require("crypto");
const Razorpay = require("razorpay");

let instance;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
};

const createOrder = async ({ amount, receipt, notes = {} }) => {
  return getRazorpay().orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: process.env.RAZORPAY_CURRENCY || "INR",
    receipt,
    notes,
  });
};

const verifySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(payload)
    .digest("hex");
  return expected === razorpaySignature;
};

const refundPayment = async ({ paymentId, amount }) => {
  return getRazorpay().payments.refund(paymentId, {
    amount: Math.round(Number(amount) * 100),
  });
};

module.exports = { createOrder, verifySignature, refundPayment };
