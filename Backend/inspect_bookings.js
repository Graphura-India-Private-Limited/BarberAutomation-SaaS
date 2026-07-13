const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const Customer = require("./models/Customer");
const Barber = require("./models/Barber");
const Salon = require("./models/Salon");
const Booking = require("./models/Booking");
const Queue = require("./models/Queue");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const bookings = await Booking.find({ booking_type: "slot" }).populate("customer_id", "name");
  console.log(`\n--- SLOT BOOKINGS (${bookings.length}) ---`);
  bookings.forEach(b => {
    console.log(`Booking ID: ${b._id}, Customer: ${b.customer_id?.name}, Status: ${b.status}, SlotTime: ${b.slot_time}, Services: ${JSON.stringify(b.services.map(s=>({ name: s.service_name, duration: s.duration })))}`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
