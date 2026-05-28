const Queue = require("../models/Queue");
const Booking = require("../models/Booking");
const Barber = require("../models/Barber");

// @desc    Mark a customer queue entry as no-show
// @route   PUT /api/noshow/:queue_id/noshow
// @access  Private
exports.markQueueEntryNoShow = async (req, res) => {
  try {
    const q = await Queue.findByIdAndUpdate(req.params.queue_id, { status: "noshow" }, { new: true });
    await Booking.findByIdAndUpdate(q.booking_id, { status: "noshow" });
    await Barber.findByIdAndUpdate(q.barber_id, { status: "available" });
    await Queue.updateMany(
      { barber_id: q.barber_id, status: "waiting", position: { $gt: q.position } },
      { $inc: { position: -1 } }
    );

    res.json({ success: true, message: "No-show marked!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delay customer queue entry
// @route   PUT /api/noshow/:queue_id/delay
// @access  Private
exports.delayQueueEntry = async (req, res) => {
  try {
    const { delay_mins } = req.body;
    const q = await Queue.findByIdAndUpdate(
      req.params.queue_id,
      { status: "delayed", estimated_wait: delay_mins || 15 },
      { new: true }
    );

    res.json({ success: true, message: `Delayed by ${delay_mins} mins`, queue: q });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Rejoin a customer queue entry at the end of the wait queue
// @route   PUT /api/noshow/:queue_id/rejoin
// @access  Private
exports.rejoinQueueEntry = async (req, res) => {
  try {
    const q = await Queue.findById(req.params.queue_id);
    const newPos = await Queue.countDocuments({ salon_id: q.salon_id, status: "waiting" }) + 1;
    await Queue.findByIdAndUpdate(req.params.queue_id, { status: "waiting", position: newPos, estimated_wait: newPos * 20 });

    res.json({ success: true, message: `Rejoined at position ${newPos}`, position: newPos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get queue statistics of a salon for today
// @route   GET /api/noshow/stats/:salon_id
// @access  Private
exports.getQueueStatsBySalon = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [waiting, completed, noshows, delayed] = await Promise.all([
      Queue.countDocuments({ salon_id: req.params.salon_id, status: "waiting" }),
      Queue.countDocuments({ salon_id: req.params.salon_id, status: "completed", joined_at: { $gte: today } }),
      Queue.countDocuments({ salon_id: req.params.salon_id, status: "noshow", joined_at: { $gte: today } }),
      Queue.countDocuments({ salon_id: req.params.salon_id, status: "delayed" })
    ]);

    res.json({ success: true, stats: { waiting, completed, noshows, delayed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
