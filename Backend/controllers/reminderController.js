const Reminder = require("../models/Reminder");

// @desc    Get customer's active reminders
// @route   GET /api/reminder
// @access  Private (Customer)
exports.getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      customer_id: req.user.id,
      is_active: true
    }).sort({ created_at: -1 });

    res.json({ success: true, reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new reminder
// @route   POST /api/reminder
// @access  Private (Customer)
exports.createReminder = async (req, res) => {
  try {
    const { title, interval_days, last_haircut_date, notify_before_days } = req.body;

    const next = new Date(last_haircut_date);
    next.setDate(next.getDate() + Number(interval_days) - Number(notify_before_days || 2));

    const reminder = await Reminder.create({
      customer_id: req.user.id,
      title,
      interval_days,
      last_haircut_date,
      notify_before_days: notify_before_days || 2,
      next_reminder_date: next
    });

    res.status(201).json({ success: true, reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a reminder
// @route   PUT /api/reminder/:id
// @access  Private (Customer)
exports.updateReminder = async (req, res) => {
  try {
    const { title, interval_days, last_haircut_date, notify_before_days } = req.body;

    const next = new Date(last_haircut_date);
    next.setDate(next.getDate() + Number(interval_days) - Number(notify_before_days || 2));

    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      {
        title,
        interval_days,
        last_haircut_date,
        notify_before_days,
        next_reminder_date: next
      },
      { new: true }
    );

    res.json({ success: true, reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Soft delete a reminder
// @route   DELETE /api/reminder/:id
// @access  Private (Customer)
exports.deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
