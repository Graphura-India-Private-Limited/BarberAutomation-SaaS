const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  owner_name:         { type:String, required:true },
  salon_name:         { type:String, required:true },
  mobile:             { type:String, required:true, unique:true },
  email:              { type:String, default:"" },
  password_hash:      { type:String, default:"" },
  address:            { type:String, default:"" },
  latitude:           { type:Number, default:0 },
  longitude:          { type:Number, default:0 },
  opening_time:       { type:String, default:"09:00" },
  closing_time:       { type:String, default:"21:00" },
  status:             { type:String, default:"pending", enum:["pending","approved","rejected","inactive"] },
  rejection_reason:   { type:String, default:"" },
  salary_model:       { type:String, default:"commission", enum:["salary","commission"] },
  commission_percent: { type:Number, default:10 },
  rating:             { type:Number, default:0 },
  total_reviews:      { type:Number, default:0 },
  images:             [String],
  about:              { type:String, default:"" },
  created_at:         { type:Date, default:Date.now },
});

module.exports = mongoose.model("Salon", salonSchema);