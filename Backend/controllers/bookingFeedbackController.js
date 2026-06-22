const BookingFeedback = require("../models/BookingFeedback");

// @desc    Submit new booking feedback
// @route   POST /api/booking-feedback
// @access  Private (Customer)
exports.createFeedback = async (req, res) => {
  try {
    const { booking_id, booking_process_rating, payment_process_rating, website_usability_rating, feedback_text } = req.body;

    if (!booking_process_rating || !payment_process_rating || !website_usability_rating) {
      return res.status(400).json({ success: false, message: "All ratings (booking process, payment process, usability) are required." });
    }

    const feedback = await BookingFeedback.create({
      customer_id: req.user.id,
      booking_id: booking_id || null,
      booking_process_rating: Number(booking_process_rating),
      payment_process_rating: Number(payment_process_rating),
      website_usability_rating: Number(website_usability_rating),
      feedback_text: feedback_text || ""
    });

    res.status(201).json({ success: true, message: "Booking feedback submitted successfully!", feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all booking feedback (for admin dashboard, if needed)
// @route   GET /api/booking-feedback
// @access  Private (Admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await BookingFeedback.find()
      .populate("customer_id", "name mobile email")
      .populate("booking_id")
      .sort({ created_at: -1 });

    res.json({ success: true, feedback: feedbackList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
