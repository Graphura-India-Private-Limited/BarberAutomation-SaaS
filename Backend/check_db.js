const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env");
    process.exit(1);
  }
  console.log("Connecting to:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const Salon = mongoose.model("Salon", new mongoose.Schema({}, { strict: false }), "salons");
  const Barber = mongoose.model("Barber", new mongoose.Schema({}, { strict: false }), "barbers");
  const Queue = mongoose.model("Queue", new mongoose.Schema({}, { strict: false }), "queues");
  const Booking = mongoose.model("Booking", new mongoose.Schema({}, { strict: false }), "bookings");
  const Customer = mongoose.model("Customer", new mongoose.Schema({}, { strict: false }), "customers");

  const salons = await Salon.find({});
  const barbers = await Barber.find({});
  const queues = await Queue.find({});
  const bookings = await Booking.find({});
  const customers = await Customer.find({});

  console.log("Salons count:", salons.length);
  salons.forEach(s => console.log(`  - Salon: ID=${s._id}, Name=${s.salon_name}, Mobile=${s.mobile}, Status=${s.status}, HasPasswordHash=${!!s.password_hash}`));

  console.log("Barbers count:", barbers.length);
  barbers.forEach(b => {
    if (b.mobile === "8888888801" || b.name.toLowerCase().includes("ali") || b.name.toLowerCase().includes("ravi")) {
      console.log(`  - Barber of Interest: ID=${b._id}, Name=${b.name}, Mobile=${b.mobile}, IsActive=${b.is_active}, Status=${b.status}, HasPasswordHash=${!!b.password_hash}, SalonID=${b.salon_id}`);
    }
  });

  console.log("Queues count:", queues.length);
  queues.forEach(q => console.log(`  - Queue: ID=${q._id}, CustomerID=${q.customer_id}, BarberID=${q.barber_id}, Status=${q.status}, BookingID=${q.booking_id}`));

  console.log("Bookings count:", bookings.length);
  console.log("Customers count:", customers.length);

  await mongoose.disconnect();
}

check().catch(console.error);
