const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  booking_id:{type:mongoose.Schema.Types.ObjectId,ref:"Booking",required:true},
  customer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  amount:{type:Number,required:true},
  payment_type:{type:String,default:"token",enum:["token","full"]},
  status:{type:String,default:"pending",enum:["pending","captured","failed","refunded"]},
  razorpay_order_id:{type:String,default:""},
  razorpay_payment_id:{type:String,default:""},
  razorpay_signature:{type:String,default:""},
  created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Payment", paymentSchema);
