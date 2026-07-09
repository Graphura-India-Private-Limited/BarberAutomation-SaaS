const Queue = require("../models/Queue");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Barber = require("../models/Barber");
const Customer = require("../models/Customer");

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Clean up stale active queue entries from previous days
    await Queue.deleteMany({
      salon_id: salon_id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] },
      joined_at: { $lt: today }
    });

    let queue = await Queue.find({
      salon_id: salon_id,
      status: { $in: ["waiting", "in-progress", "paused"] }
    })
      .populate("customer_id")
      .populate("barber_id")
      .populate("booking_id");


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
    const { status } = req.body;
    const entry = await Queue.findById(req.params.queue_id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Queue entry not found" });
    }

    entry.status = status;
    if (status === "in-progress") {
      if (entry.barber_id) {
        const activeService = await Queue.findOne({
          barber_id: entry.barber_id,
          status: "in-progress",
          _id: { $ne: entry._id }
        });
        if (activeService) {
          return res.status(400).json({ success: false, message: "Barber is already attending another customer" });
        }
      }
      entry.served_at = new Date();
    }
    await entry.save();

    // Update Booking status
    if (entry.booking_id) {
      await Booking.findByIdAndUpdate(entry.booking_id, { status: status === "noshow" ? "noshow" : status });
    }

    // Update Barber status
    if (entry.barber_id) {
      if (status === "in-progress" || status === "busy") {
        await Barber.findByIdAndUpdate(entry.barber_id, { status: "busy" });
      } else if (status === "completed" || status === "noshow") {
        await Barber.findByIdAndUpdate(entry.barber_id, { status: "available" });

        // Update positions of other waiting customers for this barber
        await Queue.updateMany(
          { barber_id: entry.barber_id, status: "waiting", position: { $gt: entry.position } },
          { $inc: { position: -1 } }
        );
      }
    }


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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await Queue.findOne({
      customer_id: req.user.id,
      status: { $in: ["waiting", "in-progress", "paused", "delayed"] },
      joined_at: { $gte: today }
    })
    .populate("salon_id", "salon_name address")
    .populate("barber_id", "name photo")
    .populate("booking_id");

    if (!entry) {
      return res.status(200).json({ success: true, active: false });
    }

    let services = [];
    if (entry.booking_id && entry.booking_id.services) {
      services = entry.booking_id.services;
    }

    let chairOccupied = false;
    if (entry.barber_id) {
      const activeSession = await Queue.findOne({
        barber_id: entry.barber_id,
        status: "in-progress",
        _id: { $ne: entry._id },
        joined_at: { $gte: today }
      });
      if (activeSession) {
        chairOccupied = true;
      }
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
        booking: entry.booking_id,
        chairOccupied
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Notify a customer about their queue status
// @route   POST /api/queue/notify
// @access  Private (Owner, Admin, Barber)
exports.notifyCustomer = async (req, res, next) => {
  try {
    const { queue_id, message } = req.body;

    const queueEntry = await Queue.findById(queue_id);
    if (!queueEntry) {
      return res.status(404).json({ success: false, message: "Queue entry not found" });
    }

    const defaultMessage = "Your service is beginning! Please come to the salon.";
    const finalMessage = message || defaultMessage;

    // Create an in-app system notification document for the specific client
    const notification = await Notification.create({
      customer_id: queueEntry.customer_id,
      title: "Your Service is Beginning! ✂️",
      message: finalMessage,
      type: "queue_turn",
      read: false
    });

    res.status(200).json({
      success: true,
      message: "Customer notified successfully!",
      notification
    });
  } catch (error) {
    next(error);
  }
};
