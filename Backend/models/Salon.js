const mongoose = require("mongoose");
const { validateMobile, validateEmailReal } = require("../utils/validation");

const salonSchema = new mongoose.Schema({
  owner_name:         { type:String, required:true },
  salon_name:         { type:String, required:true },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return validateMobile(v).valid;
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    default: "",
    validate: {
      validator: async function(v) {
        const check = await validateEmailReal(v);
        return check.valid;
      },
      message: props => `${props.value} is not a valid active email address!`
    }
  },
  password_hash:      { type:String, default:"" },
  address:            { type:String, default:"" },
  state:              { type:String, default:"Maharashtra" },
  latitude:           { type:Number, default:0 },
  longitude:          { type:Number, default:0 },
  opening_time:       { type:String, default:"09:00" },
  closing_time:       { type:String, default:"21:00" },
  services_offered:   { type:[String], default:[] },
  service_prices:     { type: Map, of: Number, default: {} },
  basic_pricing:      { type:Number, default:0 },
  number_of_barbers:  { type:Number, default:0 },
  support_number:     { type:String, default:"" },
  status:             { type:String, default:"pending", enum:["pending","approved","rejected","inactive"] },
  rejection_reason:   { type:String, default:"" },
  submitted_at:       { type:Date, default:Date.now },
  approved_at:        { type:Date, default:null },
  salary_model:       { type:String, default:"commission", enum:["salary","commission"] },
  commission_percent: { type:Number, default:10 },
  rating:             { type:Number, default:0 },
  total_reviews:      { type:Number, default:0 },
  images:             [String],
  about:              { type:String, default:"" },
  created_at:         { type:Date, default:Date.now },
  max_barbers_limit: { type: Number, default: 3 },
  gstin:             { type: String, default: "" },
  license_number:    { type: String, default: "" },
  shop_establishment_certificate: { type: String, default: "" },
  trade_license:                 { type: String, default: "" },
  gst_certificate:               { type: String, default: "" },
  aadhaar_card:                  { type: String, default: "" }
});

module.exports = mongoose.model("Salon", mongoose.modelNames().includes("Salon") ? mongoose.model("Salon").schema : salonSchema);
