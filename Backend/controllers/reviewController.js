const Review = require("../models/Review");
const Barber = require("../models/Barber");
const Salon = require("../models/Salon");

// @desc    Submit a new review
// @route   POST /api/review
// @access  Private (Customer)
exports.createReview = async (req, res) => {
  try {
    const { 
      salon_id, 
      barber_id, 
      booking_id, 
      salon_rating, 
      barber_rating, 
      review_text,
      cleanliness,
      ambience,
      staff,
      service,
      wait_time
    } = req.body;

    if (!salon_rating && !barber_rating && !review_text && !cleanliness) {
      return res.status(400).json({ success: false, message: "Add a rating or some text" });
    }

    const formattedText = cleanliness || ambience || staff || service || wait_time
      ? `[Cleanliness: ${cleanliness || 'N/A'} | Ambience: ${ambience || 'N/A'} | Staff: ${staff || 'N/A'} | Service: ${service || 'N/A'} | Waiting: ${wait_time || 'N/A'}]\n\n${review_text || ""}`.trim()
      : (review_text || "");

    const review = await Review.create({
      customer_id: req.user.id,
      salon_id: salon_id || null,
      barber_id: barber_id || null,
      booking_id: booking_id || null,
      salon_rating: salon_rating || 0,
      barber_rating: barber_rating || 0,
      cleanliness: cleanliness || "",
      ambience: ambience || "",
      staff: staff || "",
      service: service || "",
      wait_time: wait_time || "",
      review_text: formattedText
    });

    // Recalculate and update Barber average rating in real-time
    if (barber_id) {
      const allBarberReviews = await Review.find({ barber_id, is_approved: true });
      const validRatings = allBarberReviews.map(r => r.barber_rating).filter(r => r > 0);
      if (validRatings.length > 0) {
        const avg = validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
        await Barber.findByIdAndUpdate(barber_id, { rating: Number(avg.toFixed(1)) });
      }
    }

    // Recalculate and update Salon average rating in real-time
    if (salon_id) {
      const allSalonReviews = await Review.find({ salon_id, is_approved: true });
      const validSalonRatings = allSalonReviews.map(r => r.salon_rating).filter(r => r > 0);
      if (validSalonRatings.length > 0) {
        const avg = validSalonRatings.reduce((sum, r) => sum + r, 0) / validSalonRatings.length;
        await Salon.findByIdAndUpdate(salon_id, {
          rating: Number(avg.toFixed(1)),
          total_reviews: allSalonReviews.length
        });
      }
    }

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
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    const { barber_id, salon_id } = review;
    await Review.findByIdAndDelete(req.params.id);

    // Update Barber rating
    if (barber_id) {
      const allBarberReviews = await Review.find({ barber_id, is_approved: true });
      const validRatings = allBarberReviews.map(r => r.barber_rating).filter(r => r > 0);
      const avg = validRatings.length > 0 ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length : 0;
      await Barber.findByIdAndUpdate(barber_id, { rating: Number(avg.toFixed(1)) });
    }

    // Update Salon rating
    if (salon_id) {
      const allSalonReviews = await Review.find({ salon_id, is_approved: true });
      const validSalonRatings = allSalonReviews.map(r => r.salon_rating).filter(r => r > 0);
      const avg = validSalonRatings.length > 0 ? validSalonRatings.reduce((sum, r) => sum + r, 0) / validSalonRatings.length : 0;
      await Salon.findByIdAndUpdate(salon_id, {
        rating: Number(avg.toFixed(1)),
        total_reviews: allSalonReviews.length
      });
    }

    res.json({ success: true, message: "Review removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
