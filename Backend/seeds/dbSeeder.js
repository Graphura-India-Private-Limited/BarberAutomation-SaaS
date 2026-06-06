const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Salon = require("../models/Salon");
const Barber = require("../models/Barber");
const Customer = require("../models/Customer");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Queue = require("../models/Queue");

const connectDB = require("../config/db");

const seed = async () => {
  try {
    await connectDB();

    console.log("Cleaning database...");
    const demoSalonMobile = "9999999999";
    let salon = await Salon.findOne({ mobile: demoSalonMobile });
    if (salon) {
      await Barber.deleteMany({ salon_id: salon._id });
      await Service.deleteMany({ salon_id: salon._id });
      await Booking.deleteMany({ salon_id: salon._id });
      await Payment.deleteMany({ salon_id: salon._id });
      await Queue.deleteMany({ salon_id: salon._id });
      await Salon.deleteOne({ _id: salon._id });
    }

    console.log("Seeding Demo Salon...");
    const passwordHash = await bcrypt.hash("owner@123", 10);
    salon = await Salon.create({
      owner_name: "Rahul Kumar",
      salon_name: "The Royal Blade",
      mobile: demoSalonMobile,
      email: "owner@royalblade.com",
      password_hash: passwordHash,
      address: "123 MG Road, Nashik, Maharashtra",
      latitude: 20.005,
      longitude: 73.789,
      opening_time: "09:00",
      closing_time: "21:00",
      services_offered: ["Classic Haircut", "Beard Sculpting", "Luxury Head Spa", "Royal Shave"],
      basic_pricing: 250,
      number_of_barbers: 3,
      support_number: "+91 99999 99999",
      status: "approved",
      salary_model: "commission",
      commission_percent: 15,
      rating: 4.8,
      total_reviews: 45,
      images: [
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=60"
      ],
      about: "Luxury salon offering premium grooming and styling services."
    });

    console.log("Seeding Services...");
    const services = await Service.insertMany([
      { salon_id: salon._id, name: "Classic Haircut & Styling", category: "men", price: 300, duration: 30, description: "Professional haircut and hair styling session", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=60" },
      { salon_id: salon._id, name: "Premium Beard Sculpting", category: "men", price: 200, duration: 25, description: "Beard shaping, trim and hot towel finish", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&auto=format&fit=crop&q=60" },
      { salon_id: salon._id, name: "Luxury Head Spa Massage", category: "addon", price: 400, duration: 40, description: "Soothing head oil massage and hair wash", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=60" },
      { salon_id: salon._id, name: "Royal Shave Treatment", category: "men", price: 250, duration: 20, description: "Classic straight-razor shave with face cream", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=60" }
    ]);

    console.log("Seeding Barbers...");
    const barberPasswordHash = await bcrypt.hash("barber@123", 10);
    const barbers = await Barber.insertMany([
      { salon_id: salon._id, name: "Ali (Master Stylist)", mobile: "8888888801", password_hash: barberPasswordHash, specialization: "Haircuts & Styling", experience: 5, status: "available", rating: 4.9, is_active: true, aadhaar: "123456789012", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60" },
      { salon_id: salon._id, name: "Ravi (Beard Expert)", mobile: "8888888802", password_hash: barberPasswordHash, specialization: "Beard Shaving & Shaping", experience: 4, status: "busy", rating: 4.8, is_active: true, aadhaar: "987654321098", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60" },
      { salon_id: salon._id, name: "James (Color Specialist)", mobile: "8888888803", password_hash: barberPasswordHash, specialization: "Hair Coloring", experience: 6, status: "break", rating: 4.7, is_active: true, aadhaar: "456789012345", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60" }
    ]);

    console.log("Seeding Customers...");
    const customerData = [
      { name: "Suresh K.", mobile: "7777777701", email: "suresh@gmail.com" },
      { name: "Dinesh M.", mobile: "7777777702", email: "dinesh@gmail.com" },
      { name: "Prakash R.", mobile: "7777777703", email: "prakash@gmail.com" },
      { name: "Vijay S.", mobile: "7777777704", email: "vijay@gmail.com" },
      { name: "Rohan P.", mobile: "7777777705", email: "rohan@gmail.com" }
    ];
    const customers = [];
    for (let c of customerData) {
      let cust = await Customer.findOne({ mobile: c.mobile });
      if (!cust) {
        cust = await Customer.create(c);
      }
      customers.push(cust);
    }

    console.log("Seeding Payments and Bookings (Last 7 Days)...");
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d);
    }

    let orderIndex = 1;
    for (let d of dates) {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < count; j++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const barber = barbers[Math.floor(Math.random() * barbers.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        
        const booking = await Booking.create({
          customer_id: customer._id,
          salon_id: salon._id,
          barber_id: barber._id,
          booking_type: "queue",
          status: "completed",
          total_amount: service.price,
          services: [{ service_id: service._id, service_name: service.name, price: service.price }],
          created_at: d
        });

        await Payment.create({
          booking_id: booking._id,
          customer_id: customer._id,
          salon_id: salon._id,
          barber_id: barber._id,
          amount: service.price,
          payment_type: Math.random() > 0.5 ? "FULL" : "TOKEN",
          status: "SUCCESS",
          razorpay_order_id: `order_seed_${orderIndex}`,
          razorpay_payment_id: `pay_seed_${orderIndex}`,
          service_ids: [service._id],
          booking_type: "QUEUE",
          created_at: d
        });
        orderIndex++;
      }
    }

    // Seed yesterday's failed/pending transactions
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Failed transaction
    const failedBooking = await Booking.create({
      customer_id: customers[0]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      booking_type: "queue",
      status: "pending",
      total_amount: 300,
      services: [{ service_id: services[0]._id, service_name: services[0].name, price: 300 }],
      created_at: yesterday
    });
    await Payment.create({
      booking_id: failedBooking._id,
      customer_id: customers[0]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      amount: 300,
      payment_type: "FULL",
      status: "FAILED",
      razorpay_order_id: `order_seed_failed`,
      service_ids: [services[0]._id],
      booking_type: "QUEUE",
      failure_reason: "Customer card declined",
      created_at: yesterday
    });

    // Pending transaction
    const pendingBooking = await Booking.create({
      customer_id: customers[1]._id,
      salon_id: salon._id,
      barber_id: barbers[1]._id,
      booking_type: "queue",
      status: "pending",
      total_amount: 200,
      services: [{ service_id: services[1]._id, service_name: services[1].name, price: 200 }],
      created_at: yesterday
    });
    await Payment.create({
      booking_id: pendingBooking._id,
      customer_id: customers[1]._id,
      salon_id: salon._id,
      barber_id: barbers[1]._id,
      amount: 200,
      payment_type: "TOKEN",
      status: "PENDING",
      razorpay_order_id: `order_seed_pending`,
      service_ids: [services[1]._id],
      booking_type: "QUEUE",
      created_at: yesterday
    });

    console.log("Seeding active Live Queues...");
    // Queue item 1: In progress
    const b1 = await Booking.create({
      customer_id: customers[2]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      booking_type: "queue",
      status: "in-progress",
      total_amount: services[0].price,
      services: [{ service_id: services[0]._id, service_name: services[0].name, price: services[0].price }]
    });
    await Queue.create({
      booking_id: b1._id,
      customer_id: customers[2]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      position: 1,
      status: "in-progress",
    });

    // Queue item 2: Waiting
    const b2 = await Booking.create({
      customer_id: customers[3]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      booking_type: "queue",
      status: "pending",
      total_amount: services[1].price,
      services: [{ service_id: services[1]._id, service_name: services[1].name, price: services[1].price }]
    });
    await Queue.create({
      booking_id: b2._id,
      customer_id: customers[3]._id,
      salon_id: salon._id,
      barber_id: barbers[0]._id,
      position: 2,
      status: "waiting",
    });

    // Queue item 3: Unassigned waiting
    const b3 = await Booking.create({
      customer_id: customers[4]._id,
      salon_id: salon._id,
      barber_id: null,
      booking_type: "queue",
      status: "pending",
      total_amount: services[2].price,
      services: [{ service_id: services[2]._id, service_name: services[2].name, price: services[2].price }]
    });
    await Queue.create({
      booking_id: b3._id,
      customer_id: customers[4]._id,
      salon_id: salon._id,
      barber_id: null,
      position: 1,
      status: "waiting",
    });

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();
