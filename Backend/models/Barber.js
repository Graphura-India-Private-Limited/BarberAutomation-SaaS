const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const barberSchema = new mongoose.Schema({
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  name:{type:String,required:true}, mobile:{type:String,required:true,unique:true},
  password_hash:{type:String,required:true}, specialization:{type:String,default:""},
  experience:{type:Number,default:0},
  status:{type:String,default:"available",enum:["available","busy","break","offline"]},
  rating:{type:Number,default:0}, is_active:{type:Boolean,default:true},
  aadhaar:{type:String,default:""},
  image:{type:String,default:""},
  created_at:{type:Date,default:Date.now}
});
barberSchema.methods.matchPassword = async function(p){ return bcrypt.compare(p,this.password_hash); };
module.exports = mongoose.model("Barber", barberSchema);
