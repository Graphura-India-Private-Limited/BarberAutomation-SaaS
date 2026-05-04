const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  mobile:{type:String,required:true}, otp:{type:String,required:true},
  expires_at:{type:Date,required:true}, created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("OtpStore", otpSchema);
