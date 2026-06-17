const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  type: { type: String, default: "queue_turn" }, // queue_turn, delay_alert, etc.
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
