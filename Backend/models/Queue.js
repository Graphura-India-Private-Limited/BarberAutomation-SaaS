const mongoose = require("mongoose");
const queueSchema = new mongoose.Schema({
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  barber_id:{type:mongoose.Schema.Types.ObjectId,ref:"Barber",required:true},
  booking_id:{type:mongoose.Schema.Types.ObjectId,ref:"Booking",required:true},
  customer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
  position:{type:Number,required:true},
  status:{type:String,default:"waiting",enum:["waiting","in-progress","completed","noshow","cancelled","paused","delayed"]},
  estimated_wait:{type:Number,default:0},
  joined_at:{type:Date,default:Date.now}, served_at:{type:Date,default:null}
});
module.exports = mongoose.model("Queue", queueSchema);
