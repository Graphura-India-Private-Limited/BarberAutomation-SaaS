const express = require("express");
const router = express.Router();
const noshowController = require("../controllers/noshowController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

router.put("/:queue_id/noshow", protect, requireRoles("owner", "admin", "barber"), noshowController.markQueueEntryNoShow);
router.put("/:queue_id/delay", protect, requireRoles("owner", "admin", "barber"), noshowController.delayQueueEntry);
router.put("/:queue_id/rejoin", protect, requireRoles("owner", "admin", "barber"), noshowController.rejoinQueueEntry);
router.get("/stats/:salon_id", protect, requireRoles("owner", "admin", "barber"), noshowController.getQueueStatsBySalon);

module.exports = router;
