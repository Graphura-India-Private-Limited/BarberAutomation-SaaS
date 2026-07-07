const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, bookingController.createBooking);
router.get("/my", protect, bookingController.getMyBookings);
router.get("/salon/:id", bookingController.getSalonBookings);
router.put("/:id/status", protect, bookingController.updateBookingStatus);
router.put("/:id/cancel", protect, bookingController.cancelBooking);
router.get("/:id/refund-estimation", protect, bookingController.getRefundEstimation);
router.post("/:id/cancel-with-refund", protect, bookingController.cancelWithRefund);

module.exports = router;
