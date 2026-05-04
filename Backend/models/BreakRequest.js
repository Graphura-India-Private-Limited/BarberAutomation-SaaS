const mongoose = require("mongoose");
const breakSchema = new mongoose.Schema({
  barber_id:{type:mongoose.Schema.Types.ObjectId,ref:"Barber",required:true},
  break_type:{type:String,default:"short",enum:["short","long","lunch"]},
  start_time:Date, end_time:Date,
  duration_mins:{type:Number,default:15}, reason:{type:String,default:""},
  status:{type:String,default:"pending",enum:["pending","approved","rejected","ended"]},
  owner_note:{type:String,default:""}, created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("BreakRequest", breakSchema);
