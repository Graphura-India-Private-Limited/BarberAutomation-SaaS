const express = require("express");
const router = express.Router();
const bookingFeedbackController = require("../controllers/bookingFeedbackController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

/* ── POST /api/booking-feedback — Submit booking feedback (requires login) ── */
router.post("/", protect, bookingFeedbackController.createFeedback);

/* ── GET /api/booking-feedback — View all booking feedback (requires admin role) ── */
router.get("/", protect, requireRoles("admin"), bookingFeedbackController.getAllFeedback);

module.exports = router;
