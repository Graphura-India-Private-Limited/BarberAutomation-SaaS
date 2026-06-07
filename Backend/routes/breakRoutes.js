const express = require("express");
const router = express.Router();
const breakController = require("../controllers/breakController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

/* ── 1. OWNER VIEW: Get all pending requests ── */
router.get("/pending", protect, requireRoles("owner", "admin"), breakController.getPendingBreaks);

/* ── 2. OWNER ACTION: Approve or Reject ── */
router.put("/action/:id", protect, requireRoles("owner", "admin"), breakController.handleBreakAction);

module.exports = router;