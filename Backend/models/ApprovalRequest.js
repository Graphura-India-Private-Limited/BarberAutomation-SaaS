const mongoose = require("mongoose");

const approvalRequestSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true
  },
  salon_name: {
    type: String,
    required: true
  },
  owner_name: {
    type: String,
    required: true
  },
  request_type: {
    type: String,
    enum: ["address_change", "limit_increase", "general_query", "profile_update"],
    default: "address_change"
  },
  proposed_changes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  current_values: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  admin_note: {
    type: String,
    default: ""
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  resolved_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("ApprovalRequest", approvalRequestSchema);
