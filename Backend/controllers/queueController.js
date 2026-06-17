const Queue = require("../models/Queue");
const Notification = require("../models/Notification");
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

// @desc    Get active queue entry for the logged-in customer
// @route   GET /api/queue/customer/active
// @access  Private (Customer)
exports.getActiveCustomerQueue = async (req, res, next) => {
  try {
    const entry = await Queue.findOne({
      customer_id: req.user.id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] }
    })
    .populate("salon_id", "salon_name address")
    .populate("barber_id", "name")
    .populate("booking_id");

    if (!entry) {
      return res.status(200).json({ success: true, active: false });
    }

    let services = [];
    if (entry.booking_id && entry.booking_id.services) {
      services = entry.booking_id.services;
    }

    const peopleAhead = Math.max(0, entry.position - 1);
    const currentEstWait = entry.status === "in-progress" ? 0 : Math.max(20, entry.estimated_wait);

    res.status(200).json({
      success: true,
      active: true,
      queue: {
        id: entry._id,
        position: entry.position,
        peopleAhead,
        status: entry.status,
        estimated_wait: currentEstWait,
        joined_at: entry.joined_at,
        salon: entry.salon_id,
        barber: entry.barber_id,
        services,
        booking: entry.booking_id
      }
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Notify customer from queue status console
// @route   POST /api/queue/notify
// @access  Private
exports.notifyCustomer = async (req, res) => {
  try {
    const { queue_id, message } = req.body;
    if (!queue_id) {
      return res.status(400).json({ success: false, message: "Missing queue_id parameter." });
    }

    const queueEntry = await Queue.findById(queue_id);
    if (!queueEntry) {
      return res.status(404).json({ success: false, message: "Queue entry not found." });
    }

    const notif = new Notification({
      customer_id: queueEntry.customer_id,
      type: "queue_turn",
      title: "Queue Alert!",
      message: message || "Please head to the salon, your turn is coming up soon."
    });

    await notif.save();

    res.status(200).json({ success: true, message: "Notification sent successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

