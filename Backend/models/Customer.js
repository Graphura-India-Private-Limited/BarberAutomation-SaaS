const mongoose = require("mongoose");
const { validateMobile, validateEmailReal } = require("../utils/validation");

const familySchema = new mongoose.Schema({
  name: String,
  relation: { type: String, default: "Son" },
  age: String,
});

const customerSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return validateMobile(v).valid;
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    default: "",
    validate: {
      validator: async function(v) {
        const check = await validateEmailReal(v);
        return check.valid;
      },
      message: props => `${props.value} is not a valid active email address!`
    }
  },
  family_members: [familySchema],
  loyalty_points: { type: Number, default: 0 },
  
  // Upgraded Fields
  profile_picture: { type: String, default: "" },
  total_visits: { type: Number, default: 0 },
  
  // Granular Notification Toggles
  marketing_emails: { type: Boolean, default: true },
  monthly_reminders: { type: Boolean, default: true },
  new_services_alerts: { type: Boolean, default: true },
  newsletter_opt_in: { type: Boolean, default: true },
  
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
