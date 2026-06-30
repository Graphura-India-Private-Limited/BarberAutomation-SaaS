const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema({
  // Link to the barber making the request
  barber_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Barber", 
    required: true 
  },

  // The specific flow types from your requirements
  break_type: { 
    type: String, 
    default: "short", 
    enum: ["short", "long", "lunch", "leave"] 
  },

  // Timing fields for the approval system
  start_time: { 
    type: Date, 
    required: true 
  },
  end_time: { 
    type: Date 
  },

  // Duration as requested in section 4.3
  duration_mins: { 
    type: Number, 
    default: 15 
  },

  // Mandatory for "long" breaks per your logic
  reason: { 
    type: String, 
    default: "" 
  },

  // The approval flow status
  status: { 
    type: String, 
    default: "pending", 
    enum: ["pending", "approved", "rejected", "ended"] 
  },

  // Feedback from the owner during approval/rejection
  owner_note: { 
    type: String, 
    default: "" 
  },

  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Create and export the model
module.exports = mongoose.model("BreakRequest", breakSchema);