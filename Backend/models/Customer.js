const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  name: String,
  relation: { type: String, default: "Son" },
  age: String,
});

const customerSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, default: "" },
  family_members: [familySchema],
  loyalty_points: { type: Number, default: 0 },
  
  // Upgraded Fields
  profile_picture: { type: String, default: "" },
  membership_tier: { type: String, default: "Standard" }, // Standard, VIP Bronze, VIP Gold
  membership_renewal_date: { type: Date, default: null },
  total_visits: { type: Number, default: 0 },
  
  // Granular Notification Toggles
  marketing_emails: { type: Boolean, default: true },
  monthly_reminders: { type: Boolean, default: true },
  new_services_alerts: { type: Boolean, default: true },
  newsletter_opt_in: { type: Boolean, default: true },
  
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
