const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const Barber = require("./models/Barber");
const Queue = require("./models/Queue");
const Salon = require("./models/Salon");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB cluster.");

  const salons = await Salon.find();
  console.log(`\n--- SALONS (${salons.length}) ---`);
  salons.forEach(s => console.log(`Salon ID: ${s._id}, Name: ${s.salon_name}`));

  const barbers = await Barber.find();
  console.log(`\n--- BARBERS (${barbers.length}) ---`);
  barbers.forEach(b => console.log(`Barber ID: ${b._id}, Name: ${b.name}, Status: ${b.status}, IsActive: ${b.is_active}, SalonID: ${b.salon_id}`));

  const queue = await Queue.find();
  console.log(`\n--- QUEUE ENTRIES (${queue.length}) ---`);
  queue.forEach(q => console.log(`Queue ID: ${q._id}, CustomerID: ${q.customer_id}, BarberID: ${q.barber_id}, Status: ${q.status}, Position: ${q.position}, SalonID: ${q.salon_id}`));

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
