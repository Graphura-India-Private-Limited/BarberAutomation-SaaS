const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const Salon = require("./models/Salon");
  const Barber = require("./models/Barber");

  let testSalon = await Salon.findOne({ mobile: "9999999999" });
  if (!testSalon) {
    const salon_hash = await bcrypt.hash("owner@123", 10);
    testSalon = await Salon.create({
      owner_name: "Ravi (Owner)",
      salon_name: "The Royal Touch Salon",
      mobile: "9999999999",
      password_hash: salon_hash,
      status: "approved",
      salary_model: "commission",
      commission_percent: 30,
      address: "123 MG Road, Mumbai",
      state: "Maharashtra"
    });
    console.log("Created test owner salon.");
  } else {
    console.log("Test owner salon already exists.");
  }

  let testBarber = await Barber.findOne({ mobile: "8888888801" });
  if (!testBarber) {
    const barber_hash = await bcrypt.hash("Barber@123", 10);
    testBarber = await Barber.create({
      salon_id: testSalon._id,
      name: "Ali (Master Stylist)",
      mobile: "8888888801",
      password_hash: barber_hash,
      specialization: "Haircut & Beard Expert",
      experience: 7,
      status: "available",
      rating: 4.8,
      is_active: true
    });
    console.log("Created test barber Ali.");
  } else {
    console.log("Test barber Ali already exists.");
  }

  await mongoose.disconnect();
  console.log("Disconnected.");
}

run().catch(console.error);
