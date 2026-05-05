const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  booking_id:{type:mongoose.Schema.Types.ObjectId,ref:"Booking",required:true},
  customer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  barber_id:{type:mongoose.Schema.Types.ObjectId,ref:"Barber",default:null},
  rating:{type:Number,required:true,min:1,max:5},
  review_text:{type:String,default:""}, created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Review", reviewSchema);
