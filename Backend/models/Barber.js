const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { validateMobile, validateEmailReal } = require("../utils/validation");
const barberSchema = new mongoose.Schema({
  salon_id:{type:mongoose.Schema.Types.ObjectId,ref:"Salon",required:true},
  name:{type:String,required:true},
  mobile:{
    type:String,
    required:true,
    unique:true,
    validate: {
      validator: function(v) {
        return validateMobile(v).valid;
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  password_hash:{type:String,required:true}, specialization:{type:String,default:""},
  experience:{type:Number,default:0},
  status:{type:String,default:"available",enum:["available","busy","break"]},
  rating:{type:Number,default:0}, is_active:{type:Boolean,default:true},
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
  aadhaar: { type: String, default: "" },
  pan: { type: String, default: "" },
  photo: { type: String, default: "" },
  document: { type: String, default: "" },
  documentName: { type: String, default: "" },
  created_at:{type:Date,default:Date.now}
});
barberSchema.methods.matchPassword = async function(p){ return bcrypt.compare(p,this.password_hash); };

const updateSalonBarberCount = async (salonId) => {
  if (!salonId) return;
  try {
    const Barber = mongoose.model("Barber");
    let Salon;
    try {
      Salon = mongoose.model("Salon");
    } catch (e) {
      Salon = require("./Salon");
    }
    const count = await Barber.countDocuments({ salon_id: salonId, is_active: true });
    await Salon.findByIdAndUpdate(salonId, { number_of_barbers: count });
  } catch (err) {
    console.error("Failed to update salon barber count in Barber middleware:", err);
  }
};

barberSchema.post("save", async function(doc) {
  if (doc && doc.salon_id) {
    await updateSalonBarberCount(doc.salon_id);
  }
});

barberSchema.post("findOneAndUpdate", async function(doc) {
  if (doc && doc.salon_id) {
    await updateSalonBarberCount(doc.salon_id);
  }
});

module.exports = mongoose.model("Barber", barberSchema);

