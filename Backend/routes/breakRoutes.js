const express = require("express");
const router = express.Router();
const breakController = require("../controllers/breakController");

/* ── 1. OWNER VIEW: Get all pending requests ── */
router.get("/pending", breakController.getPendingBreaks);

/* ── 2. OWNER ACTION: Approve or Reject ── */
router.put("/action/:id", breakController.handleBreakAction);

module.exports = router;