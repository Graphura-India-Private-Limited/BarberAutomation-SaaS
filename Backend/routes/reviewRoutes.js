const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

/* ── POST /api/review — Submit new review (requires login) ── */
router.post("/", protect, reviewController.createReview);

/* ── GET /api/review — All approved reviews (for homepage) ── */
router.get("/", reviewController.getAllApprovedReviews);

/* ── GET /api/review/salon/:salon_id — Reviews of a salon (owner dashboard) ── */
router.get("/salon/:salon_id", reviewController.getSalonReviews);

/* ── GET /api/review/barber/:barber_id — Reviews of a barber (barber dashboard) ── */
router.get("/barber/:barber_id", reviewController.getBarberReviews);

/* ── GET /api/review/my — Customer's own reviews ── */
router.get("/my", protect, reviewController.getMyReviews);

/* ── DELETE /api/review/:id — Admin can delete inappropriate reviews ── */
router.delete("/:id", protect, requireRoles("admin", "owner"), reviewController.deleteReview);

module.exports = router;