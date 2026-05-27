const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { protect } = require("../middleware/authMiddleware");

/* ── DASHBOARD STATS ── */
router.get("/salon/:salon_id/dashboard", protect, ownerController.getOwnerDashboardStats);

/* ── BREAK REQUESTS ── */
router.get("/salon/:salon_id/break-requests", protect, ownerController.getBreakRequests);
router.put("/break-request/:id", protect, ownerController.handleBreakRequestAction);

/* ── QUEUE — REASSIGN ── */
router.put("/queue/:queue_id/reassign", protect, ownerController.reassignQueueEntry);

/* ── MANUAL ASSIGN ── */
router.post("/queue/:queue_id/assign", protect, ownerController.manualAssignQueueEntry);

/* ── AUTO-ASSIGN ── */
router.post("/queue/:queue_id/auto-assign", protect, ownerController.autoAssignQueueEntry);

/* ── START SERVICE ── */
router.put("/queue/:queue_id/start", protect, ownerController.startService);

/* ── COMPLETE SERVICE ── */
router.put("/queue/:queue_id/complete", protect, ownerController.completeService);

/* ── TEMPORARY ERROR INTERCEPTOR: OWNER LOGIN ── */
router.post("/owner/login", ownerController.debugOwnerLoginBypass);

module.exports = router;