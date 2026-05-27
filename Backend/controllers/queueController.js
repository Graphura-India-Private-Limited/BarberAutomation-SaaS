const Queue = require("../models/Queue");
const mongoose = require("mongoose");

// @desc    Get active queue entries for a specific salon
// @route   GET /api/queue/:salon_id
// @access  Private (Authenticated users)
exports.getSalonQueue = async (req, res, next) => {
  try {
    const { salon_id } = req.params;

    // ✅ Defensive check: If the passed ID isn't a valid ObjectId format, safely exit instead of crashing
    if (!mongoose.Types.ObjectId.isValid(salon_id)) {
      return res.status(200).json({ success: true, queue: [] });
    }

    const queue = await Queue.find({
      salon_id: salon_id,
      status: { $in: ["waiting", "in-progress", "paused"] }
    }).populate("customer_id");

    res.status(200).json({ success: true, queue });
  } catch (error) {
    next(error); // Passes execution down safely to server error boundary middleware
  }
};

// @desc    Update a queue entry status
// @route   PUT /api/queue/:queue_id/status
// @access  Private
exports.updateQueueStatus = async (req, res) => {
  try {
    const entry = await Queue.findByIdAndUpdate(
      req.params.queue_id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
