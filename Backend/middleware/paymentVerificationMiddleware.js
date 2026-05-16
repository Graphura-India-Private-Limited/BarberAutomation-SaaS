const razorpayService = require("../services/razorpayService");

const verifyPaymentSignature = (req, res, next) => {
  const razorpayOrderId = req.body.razorpayOrderId || req.body.razorpay_order_id;
  const razorpayPaymentId = req.body.razorpayPaymentId || req.body.razorpay_payment_id;
  const razorpaySignature = req.body.razorpaySignature || req.body.razorpay_signature;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: "Razorpay order, payment and signature are required" });
  }

  if (!razorpayService.verifySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
    return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
  }

  next();
};

module.exports = { verifyPaymentSignature };
