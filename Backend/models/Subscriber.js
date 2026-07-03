const mongoose = require("mongoose");
const { validateEmailReal } = require("../utils/validation");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: async function(v) {
        const check = await validateEmailReal(v);
        return check.valid;
      },
      message: props => `${props.value} is not a valid active email address!`
    }
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
