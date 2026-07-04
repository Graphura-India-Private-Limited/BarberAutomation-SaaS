const Subscriber = require("../models/Subscriber");
const { validateEmailReal } = require("../utils/validation");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required." });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailCheck = await validateEmailReal(emailTrimmed);
    if (!emailCheck.valid) {
      return res.status(400).json({ success: false, message: emailCheck.message });
    }

    // Check if email already exists
    const exists = await Subscriber.findOne({ email: emailTrimmed });
    if (exists) {
      return res.status(400).json({ success: false, message: "This email address is already subscribed!" });
    }

    const newSubscriber = await Subscriber.create({ email: emailTrimmed });
    res.status(201).json({
      success: true,
      message: "Subscription successful! Welcome to BarberPro newsletter.",
      data: newSubscriber,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Public (Can be protected, but open for dashboard integration)
exports.getSubscribers = async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      query.email = { $regex: q.trim(), $options: "i" };
    }

    const subscribers = await Subscriber.find(query).sort({ created_at: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a newsletter subscriber
// @route   DELETE /api/newsletter/subscriber/:id
// @access  Public (Admin action)
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }
    res.status(200).json({
      success: true,
      message: "Subscriber removed successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
