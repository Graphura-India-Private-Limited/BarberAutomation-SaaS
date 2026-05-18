const crypto = require("crypto");

const verifyRazorpayWebhook = (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: "Webhook secret is not configured" });
  }

  const signature = req.headers["x-razorpay-signature"];
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!signature || signature !== expected) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  req.razorpayEvent = JSON.parse(rawBody.toString("utf8"));
  next();
};

module.exports = { verifyRazorpayWebhook };
