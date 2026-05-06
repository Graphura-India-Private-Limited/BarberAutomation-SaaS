const mongoose = require("mongoose");
const familySchema = new mongoose.Schema({ name:String, relation:{type:String,default:"Son"}, age:String });
const customerSchema = new mongoose.Schema({
  name:{type:String,default:""}, mobile:{type:String,required:true,unique:true},
  email:{type:String,default:""}, family_members:[familySchema],
  loyalty_points:{type:Number,default:0}, created_at:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Customer", customerSchema);
