const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

/* ── DASHBOARD STATS ── */
router.get("/salon/:salon_id/dashboard", protect, requireRoles("owner", "admin"), ownerController.getOwnerDashboardStats);

/* ── BREAK REQUESTS ── */
router.get("/salon/:salon_id/break-requests", protect, requireRoles("owner", "admin"), ownerController.getBreakRequests);
router.put("/break-request/:id", protect, requireRoles("owner", "admin"), ownerController.handleBreakRequestAction);

/* ── QUEUE — REASSIGN ── */
router.put("/queue/:queue_id/reassign", protect, requireRoles("owner", "admin"), ownerController.reassignQueueEntry);

/* ── MANUAL ASSIGN ── */
router.post("/queue/:queue_id/assign", protect, requireRoles("owner", "admin"), ownerController.manualAssignQueueEntry);

/* ── AUTO-ASSIGN ── */
router.post("/queue/:queue_id/auto-assign", protect, requireRoles("owner", "admin"), ownerController.autoAssignQueueEntry);

/* ── START SERVICE ── */
router.put("/queue/:queue_id/start", protect, requireRoles("owner", "admin"), ownerController.startService);

/* ── COMPLETE SERVICE ── */
router.put("/queue/:queue_id/complete", protect, requireRoles("owner", "admin"), ownerController.completeService);

/* ── APPROVAL REQUESTS ── */
router.get("/salon/:salon_id/approval-requests", protect, requireRoles("owner", "admin"), ownerController.getSalonApprovalRequests);

module.exports = router;