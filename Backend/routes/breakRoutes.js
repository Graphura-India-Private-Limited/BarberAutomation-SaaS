const express = require("express");
const router  = express.Router();
const BreakRequest = require("../models/BreakRequest");
const Barber = require("../models/Barber"); // To update barber status

/* ── 1. OWNER VIEW: Get all pending requests (Flow 4.4) ── */
router.get("/pending", async (req, res) => {
  try {
    const pending = await BreakRequest.find({ status: "pending" })
      .populate("barber_id", "name"); // Shows barber name in the list
    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── 2. OWNER ACTION: Approve or Reject (Flow 4.1) ── */
router.put("/action/:id", async (req, res) => {
  try {
    const { status, owner_note } = req.body; // Expects "approved" or "rejected"
    
    // Find the specific request
    const request = await BreakRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    // Update the request status
    request.status = status;
    request.owner_note = owner_note || "";
    await request.save();

    // LOGIC: If approved, update the Barber's status to block the queue
    if (status === "approved") {
      await Barber.findByIdAndUpdate(request.barber_id, {
        is_on_break: true,
        current_break_id: request._id
      });
    }

    res.json({ 
      success: true, 
      message: `Request ${status} successfully.`,
      data: request 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;