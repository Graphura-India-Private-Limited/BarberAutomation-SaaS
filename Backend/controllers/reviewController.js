const Review = require("../models/Review");

// @desc    Submit a new review
// @route   POST /api/review
// @access  Private (Customer)
exports.createReview = async (req, res) => {
  try {
    const { salon_id, barber_id, booking_id, salon_rating, barber_rating, review_text } = req.body;

    if (!salon_rating && !barber_rating && !review_text) {
      return res.status(400).json({ success: false, message: "Add a rating or some text" });
    }

    const review = await Review.create({
      customer_id: req.user.id,
      salon_id: salon_id || null,
      barber_id: barber_id || null,
      booking_id: booking_id || null,
      salon_rating: salon_rating || 0,
      barber_rating: barber_rating || 0,
      review_text: review_text || ""
    });

    res.json({ success: true, message: "Review submitted!", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all approved reviews (for homepage)
// @route   GET /api/review
// @access  Public
exports.getAllApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ is_approved: true })
      .populate("customer_id", "name")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 })
      .limit(20);

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all approved reviews for a specific salon
// @route   GET /api/review/salon/:salon_id
// @access  Public/Owner
exports.getSalonReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ salon_id: req.params.salon_id, is_approved: true })
      .populate("customer_id", "name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all approved reviews for a specific barber
// @route   GET /api/review/barber/:barber_id
// @access  Public/Barber
exports.getBarberReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ barber_id: req.params.barber_id, is_approved: true })
      .populate("customer_id", "name")
      .sort({ created_at: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get customer's own reviews
// @route   GET /api/review/my
// @access  Private (Customer)
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer_id: req.user.id })
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/review/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
