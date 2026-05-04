const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema({
  customer_id:{type:mongoose.Schema.Types.ObjectId,ref:"Customer",required:true},
  title:{type:String,default:"Haircut Reminder"},
  interval_days:{type:Number,required:true,default:20},
  last_haircut_date:{type:Date,required:true},
  notify_before_days:{type:Number,default:2},
  next_reminder_date:{type:Date},
  is_active:{type:Boolean,default:true},
  created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Reminder", reminderSchema);
