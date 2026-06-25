const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  customer_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  salon_id:      { type: mongoose.Schema.Types.ObjectId, ref: "Salon",    default: null },
  barber_id:     { type: mongoose.Schema.Types.ObjectId, ref: "Barber",   default: null },
  booking_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Booking",  default: null },
  salon_rating:  { type: Number, min: 0, max: 5, default: 5 },
  barber_rating: { type: Number, min: 0, max: 5, default: 5 },
  cleanliness:   { type: String, default: "" },
  ambience:      { type: String, default: "" },
  staff:         { type: String, default: "" },
  service:       { type: String, default: "" },
  wait_time:     { type: String, default: "" },
  review_text:   { type: String, default: "" },
  is_approved:   { type: Boolean, default: true },
  created_at:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);