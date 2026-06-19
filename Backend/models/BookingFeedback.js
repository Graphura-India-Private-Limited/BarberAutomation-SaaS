const mongoose = require("mongoose");

const bookingFeedbackSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
  booking_process_rating: { type: Number, min: 1, max: 5, required: true },
  payment_process_rating: { type: Number, min: 1, max: 5, required: true },
  website_usability_rating: { type: Number, min: 1, max: 5, required: true },
  feedback_text: { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BookingFeedback", bookingFeedbackSchema);
