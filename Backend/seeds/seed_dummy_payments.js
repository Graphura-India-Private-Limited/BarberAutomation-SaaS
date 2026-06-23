require("dotenv").config();
const mongoose = require("mongoose");
const Salon = require("../models/Salon");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/BarberAutomation";

const seed = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const salons = await Salon.find({ status: "approved" });
    console.log(`Found ${salons.length} approved salons.`);
    if (salons.length === 0) {
      console.log("No approved salons found! Please approve some salons first.");
      process.exit(0);
    }

    let customers = await Customer.find({});
    console.log(`Found ${customers.length} customers.`);
    if (customers.length === 0) {
      console.log("Creating dummy customers...");
      const dummyCusts = [
        { name: "John Doe", mobile: "9876543210", email: "john@example.com" },
        { name: "Alice Smith", mobile: "9876543211", email: "alice@example.com" },
        { name: "Bob Johnson", mobile: "9876543212", email: "bob@example.com" },
        { name: "Emily Davis", mobile: "9876543213", email: "emily@example.com" },
        { name: "Charlie Brown", mobile: "9876543214", email: "charlie@example.com" }
      ];
      customers = await Customer.insertMany(dummyCusts);
      console.log(`Created ${customers.length} dummy customers.`);
    }

    // Clean previous dummy records
    console.log("Cleaning old dummy bookings and payments...");
    const deletedPayments = await Payment.deleteMany({ razorpay_payment_id: { $regex: /^dummy_/ } });
    const deletedBookings = await Booking.deleteMany({ notes: "Seed dummy booking" });
    console.log(`Deleted ${deletedPayments.deletedCount} old dummy payments and ${deletedBookings.deletedCount} bookings.`);

    const now = new Date();
    
    // Generate dates helper
    const getPastDate = (daysAgo) => {
      const d = new Date();
      d.setDate(now.getDate() - daysAgo);
      // Randomize hours/minutes/seconds
      d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      return d;
    };

    const paymentRecords = [];
    const bookingRecords = [];

    for (const salon of salons) {
      console.log(`Seeding for Salon: ${salon.salon_name}...`);

      // Define date profile for 20 entries:
      const daysOffset = [0, 0, 0, 0, 1, 2, 4, 5, 6, 10, 12, 15, 20, 24, 28, 45, 90, 120, 180, 270];
      const statuses = [
        "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS",
        "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "FAILED", "PENDING", "PENDING"
      ];

      for (let i = 0; i < 20; i++) {
        const customer = customers[i % customers.length];
        const date = getPastDate(daysOffset[i]);
        const status = statuses[i];
        
        // Amount above 500 Rupees (in Rupees: 550 to 2450) -> in Paise: 55000 to 245000
        const amountRupees = Math.floor(Math.random() * 1900) + 550; // 550 to 2450
        const amountPaise = amountRupees * 100;

        // Create booking
        const bookingStatus = status === "SUCCESS" ? "completed" : status === "FAILED" ? "cancelled" : "pending";
        const bookingId = new mongoose.Types.ObjectId();
        
        const booking = {
          _id: bookingId,
          salon_id: salon._id,
          customer_id: customer._id,
          date: date.toISOString().split("T")[0],
          time: "14:00",
          status: bookingStatus,
          total_amount: amountRupees,
          notes: "Seed dummy booking",
          created_at: date,
          updated_at: date
        };
        bookingRecords.push(booking);

        // Create payment
        const payment = {
          booking_id: bookingId,
          customer_id: customer._id,
          salon_id: salon._id,
          amount: amountPaise,
          payment_type: i % 3 === 0 ? "FULL" : "TOKEN",
          status: status,
          razorpay_order_id: `dummy_order_${salon._id.toString().slice(-4)}_${i}_${Date.now()}`,
          razorpay_payment_id: `dummy_pay_${salon._id.toString().slice(-4)}_${i}_${Date.now()}`,
          booking_type: "SLOT",
          created_at: date,
          updated_at: date
        };
        paymentRecords.push(payment);
      }
    }

    console.log("Inserting Bookings...");
    await Booking.insertMany(bookingRecords);
    console.log("Inserting Payments...");
    await Payment.insertMany(paymentRecords);

    console.log(`Successfully seeded ${bookingRecords.length} bookings and ${paymentRecords.length} payments!`);
    mongoose.connection.close();
    console.log("Connection closed.");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seed();
