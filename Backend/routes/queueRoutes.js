const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:salon_id", protect, queueController.getSalonQueue);
router.put("/:queue_id/status", protect, queueController.updateQueueStatus);

module.exports = router;
