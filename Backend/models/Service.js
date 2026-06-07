const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  name:{type:String,required:true},
  category:{type:String,default:"men",enum:["men","women","addon"]},
  price:{type:Number,required:true}, duration:{type:Number,default:30},
  description:{type:String,default:""}, image:{type:String,default:""}, is_active:{type:Boolean,default:true},
  created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Service", serviceSchema);
