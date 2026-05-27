const express = require("express");
const router = express.Router();
const noshowController = require("../controllers/noshowController");
const { protect } = require("../middleware/authMiddleware");

router.put("/:queue_id/noshow", protect, noshowController.markQueueEntryNoShow);
router.put("/:queue_id/delay", protect, noshowController.delayQueueEntry);
router.put("/:queue_id/rejoin", protect, noshowController.rejoinQueueEntry);
router.get("/stats/:salon_id", protect, noshowController.getQueueStatsBySalon);

module.exports = router;
