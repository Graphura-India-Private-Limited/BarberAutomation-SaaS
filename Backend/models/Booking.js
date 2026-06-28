const mongoose = require("mongoose");
const bsSchema = new mongoose.Schema({
  service_id:{type:mongoose.Schema.Types.ObjectId,ref:"Service"},
  service_name:String, price:Number, duration:{type:Number,default:30}, member_name:{type:String,default:"Self"}
});
const bookingSchema = new mongoose.Schema({
  customer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  barber_id:{type:mongoose.Schema.Types.ObjectId,ref:"Barber",default:null},
  booking_type:{type:String,default:"queue",enum:["queue","slot"]},
  status:{type:String,default:"pending",enum:["pending","confirmed","in-progress","completed","cancelled","noshow"]},
  total_amount:{type:Number,default:0}, services:[bsSchema],
  slot_time:{type:String,default:null}, rating:{type:Number,default:null},
  notes:{type:String,default:""},
  promo_code:{type:String,default:""},
  created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Booking", bookingSchema);
