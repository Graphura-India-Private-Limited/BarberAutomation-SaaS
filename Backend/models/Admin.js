const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email:         { type:String, required:true, unique:true },
  mobile:        { type:String, default:"" },
  password_hash: { type:String, required:true },
  mpin_hash:     { type:String, required:true },
  created_at:    { type:Date, default:Date.now },
});

adminSchema.methods.matchPassword = async function(p) {
  return bcrypt.compare(p, this.password_hash);
};
adminSchema.methods.matchMpin = async function(m) {
  return bcrypt.compare(m, this.mpin_hash);
};

module.exports = mongoose.model("Admin", adminSchema);