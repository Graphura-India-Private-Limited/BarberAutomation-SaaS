const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

router.get("/:salon_id", protect, requireRoles("owner", "admin", "barber", "customer"), queueController.getSalonQueue);
router.put("/:queue_id/status", protect, requireRoles("owner", "admin", "barber"), queueController.updateQueueStatus);

module.exports = router;
