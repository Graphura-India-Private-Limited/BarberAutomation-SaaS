const BreakRequest = require("../models/BreakRequest");
const Barber = require("../models/Barber");
const Queue = require("../models/Queue");

// @desc    Get all pending break requests (Owner view)
// @route   GET /api/breaks/pending
// @access  Private (Owner)
exports.getPendingBreaks = async (req, res) => {
  try {
    let filter = { status: "pending" };
    if (req.user && req.user.role === "owner") {
      const barbers = await Barber.find({ salon_id: req.user._id }, "_id");
      const ids = barbers.map(b => b._id);
      filter.barber_id = { $in: ids };
    }

    const pending = await BreakRequest.find(filter)
      .populate("barber_id", "name");

    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve or Reject a break request (Owner action)
// @route   PUT /api/breaks/action/:id
// @access  Private (Owner)
exports.handleBreakAction = async (req, res) => {
  try {
    const { status, owner_note } = req.body; // "approved" or "rejected"

    const request = await BreakRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    request.owner_note = owner_note || "";
    await request.save();

    // If approved, update Barber's status to block queue and pause queue items
    if (status === "approved") {
      await Barber.findByIdAndUpdate(request.barber_id, { status: "break" });
      await Queue.updateMany(
        { barber_id: request.barber_id, status: "waiting" },
        { status: "paused" }
      );
    }

    res.json({
      success: true,
      message: `Request ${status} successfully.`,
      data: request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
