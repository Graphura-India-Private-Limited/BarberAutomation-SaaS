const express = require("express");
const router  = express.Router();
const Review  = require("../models/Review");
const { protect } = require("../middleware/authMiddleware");

/* ── POST /api/review — Submit new review (requires login) ── */
router.post("/", protect, async (req, res) => {
  try {
    const { salon_id, barber_id, booking_id, salon_rating, barber_rating, review_text } = req.body;
    if (!salon_rating && !barber_rating && !review_text) {
      return res.status(400).json({ success: false, message: "Add a rating or some text" });
    }
    const review = await Review.create({
      customer_id:   req.user.id,
      salon_id:      salon_id    || null,
      barber_id:     barber_id   || null,
      booking_id:    booking_id  || null,
      salon_rating:  salon_rating  || 0,
      barber_rating: barber_rating || 0,
      review_text:   review_text || "",
    });
    res.json({ success: true, message: "Review submitted!", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/review — All approved reviews (for homepage) ── */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ is_approved: true })
      .populate("customer_id", "name")
      .populate("salon_id",    "salon_name")
      .populate("barber_id",   "name")
      .sort({ created_at: -1 })
      .limit(20);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/review/salon/:salon_id — Reviews of a salon (owner dashboard) ── */
router.get("/salon/:salon_id", async (req, res) => {
  try {
    const reviews = await Review.find({ salon_id: req.params.salon_id, is_approved: true })
      .populate("customer_id", "name")
      .populate("barber_id",   "name")
      .sort({ created_at: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/review/barber/:barber_id — Reviews of a barber (barber dashboard) ── */
router.get("/barber/:barber_id", async (req, res) => {
  try {
    const reviews = await Review.find({ barber_id: req.params.barber_id, is_approved: true })
      .populate("customer_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/review/my — Customer's own reviews ── */
router.get("/my", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ customer_id: req.user.id })
      .populate("salon_id",  "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/review/:id — Admin can delete inappropriate reviews ── */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;