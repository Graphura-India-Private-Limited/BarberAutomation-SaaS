const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Salon = require("../models/Salon");
const Barber = require("../models/Barber");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const Queue = require("../models/Queue");
const BreakRequest = require("../models/BreakRequest");
const ApprovalRequest = require("../models/ApprovalRequest");
const BookingFeedback = require("../models/BookingFeedback");
const Notification = require("../models/Notification");
const OtpStore = require("../models/OtpStore");
const Reminder = require("../models/Reminder");
const Subscriber = require("../models/Subscriber");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/BarberAutomation";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const stateCoordinates = {
  "Andhra Pradesh": { lat: 16.5062, lng: 80.6480 },
  "Arunachal Pradesh": { lat: 27.0844, lng: 93.6053 },
  "Assam": { lat: 26.1445, lng: 91.7362 },
  "Bihar": { lat: 25.5941, lng: 85.1376 },
  "Chhattisgarh": { lat: 21.2514, lng: 81.6296 },
  "Goa": { lat: 15.4909, lng: 73.8278 },
  "Gujarat": { lat: 23.2156, lng: 72.6369 },
  "Haryana": { lat: 30.7333, lng: 76.7794 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Jharkhand": { lat: 23.3441, lng: 85.3096 },
  "Karnataka": { lat: 12.9716, lng: 77.5946 },
  "Kerala": { lat: 8.5241, lng: 76.9366 },
  "Madhya Pradesh": { lat: 23.2599, lng: 77.4126 },
  "Maharashtra": { lat: 18.5204, lng: 73.8567 }, // Pune, Maharashtra (nearest to user's Pune location)
  "Manipur": { lat: 24.8170, lng: 93.9368 },
  "Meghalaya": { lat: 25.5788, lng: 91.8831 },
  "Mizoram": { lat: 23.7271, lng: 92.7176 },
  "Nagaland": { lat: 25.6751, lng: 94.1086 },
  "Odisha": { lat: 20.2961, lng: 85.8245 },
  "Punjab": { lat: 30.7333, lng: 76.7794 },
  "Rajasthan": { lat: 26.9124, lng: 75.7873 },
  "Sikkim": { lat: 27.3314, lng: 88.6138 },
  "Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
  "Telangana": { lat: 17.3850, lng: 78.4867 },
  "Tripura": { lat: 23.8315, lng: 91.2868 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { lat: 30.3165, lng: 78.0322 },
  "West Bengal": { lat: 22.5726, lng: 88.3639 }
};

const suffixes = [
  ["Royal Grooming", "Premium Stylists"],
  ["Elite Cuts", "Cuts & Shaves"],
  ["Classic Stylists", "Crown Salon"],
  ["Barbershop Lounge", "Heritage Barbers"],
  ["Luxe Studios", "Vogue Studio"],
  ["Signature Salon", "Velvet Salon"],
  ["Imperial Hair Care", "Modern Edge Lounge"],
  ["Grand Grooming", "Signature Hair Lounge"]
];

const barberNames = [
  "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Kabir", "Reyansh", "Krishna", 
  "Ishaan", "Shaurya", "Rohan", "Rahul", "Aman", "Amit", "Vikram", "Ravi", 
  "Sanjay", "Deepak", "Anil", "Sunil", "Vijay", "Rajesh", "Prakash", "Manish", 
  "Alok", "Vivek", "Sandeep", "Ajay", "Pranav", "Karan", "Nikhil", "Gaurav", 
  "Yash", "Abhishek", "Harsh", "Rohit", "Vikrant", "Piyush", "Varun", "Sameer"
];

const salonImages = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80"
];

const seedData = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear all existing collections
    console.log("Cleaning database collections...");
    await Salon.deleteMany({});
    await Barber.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await Queue.deleteMany({});
    await BreakRequest.deleteMany({});
    await ApprovalRequest.deleteMany({});
    await BookingFeedback.deleteMany({});
    await Notification.deleteMany({});
    await OtpStore.deleteMany({});
    await Reminder.deleteMany({});
    await Subscriber.deleteMany({});
    console.log("Database cleared successfully.");

    const passwordHash = bcrypt.hashSync("password123", 10);
    let ownerMobileCount = 9000000000;
    let barberMobileCount = 8000000000;

    console.log(`Generating salons and barbers for ${states.length} states...`);

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      const suffixPair = suffixes[i % suffixes.length];
      const coords = stateCoordinates[state] || { lat: 18.5204, lng: 73.8567 };

      const salonConfigs = [
        {
          name: `${state} ${suffixPair[0]}`,
          address: `101 Main Street, MG Road, Capital City, ${state}`,
          lat: coords.lat + (Math.random() - 0.5) * 0.1, // Add noise for uniqueness (approx 10km)
          lng: coords.lng + (Math.random() - 0.5) * 0.1
        }
      ];

      for (let sIdx = 0; sIdx < salonConfigs.length; sIdx++) {
        const config = salonConfigs[sIdx];
        ownerMobileCount++;

        const salon = await Salon.create({
          owner_name: `${state} Owner ${sIdx + 1}`,
          salon_name: config.name,
          mobile: String(ownerMobileCount),
          email: `${config.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@barberpro.com`,
          password_hash: passwordHash,
          address: config.address,
          state: state,
          latitude: Number(config.lat.toFixed(4)),
          longitude: Number(config.lng.toFixed(4)),
          opening_time: "09:00",
          closing_time: "21:00",
          services_offered: [],
          service_prices: {},
          basic_pricing: 150 + Math.floor(Math.random() * 100),
          number_of_barbers: 5,
          status: "approved",
          approved_at: new Date(),
          salary_model: "commission",
          commission_percent: 15,
          rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
          total_reviews: Math.floor(Math.random() * 60) + 12,
          images: [
            salonImages[(i * 2 + sIdx) % salonImages.length],
            salonImages[(i * 2 + sIdx + 1) % salonImages.length]
          ],
          about: `Welcome to ${config.name}, the premium destination for modern grooming in ${state}. We combine expert styling with top-tier convenience.`,
          max_barbers_limit: 10,
          gstin: `27ABCDE${1000 + ownerMobileCount - 9000000000}F1Z5`,
          license_number: `LIC-${500000 + ownerMobileCount - 9000000000}`,
          shop_establishment_certificate: "https://barberpro-certificates.s3.amazonaws.com/dummy_establishment.pdf",
          trade_license: "https://barberpro-certificates.s3.amazonaws.com/dummy_license.pdf",
          gst_certificate: "https://barberpro-certificates.s3.amazonaws.com/dummy_gst.pdf",
          aadhaar_card: "https://barberpro-certificates.s3.amazonaws.com/dummy_aadhaar.pdf"
        });

        // Seed 5 Barbers for this Salon
        const usedNames = new Set();
        for (let bIdx = 0; bIdx < 5; bIdx++) {
          barberMobileCount++;
          
          let name;
          do {
            name = barberNames[Math.floor(Math.random() * barberNames.length)];
          } while (usedNames.has(name));
          usedNames.add(name);

          const specs = ["Executive Cut", "Beard Sculpt", "Skin Fade", "Razor Shave", "Scalp Ritual"];
          const specialties = specs.slice(0, 3 + Math.floor(Math.random() * 3));

          await Barber.create({
            salon_id: salon._id,
            name: `${name} Barber`,
            mobile: String(barberMobileCount),
            password_hash: passwordHash,
            specialization: specialties.join(", "),
            experience: Math.floor(Math.random() * 8) + 2,
            status: bIdx === 1 ? "busy" : "available",
            rating: Number((4.2 + Math.random() * 0.8).toFixed(1)),
            is_active: true,
            email: `${name.toLowerCase()}@${config.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
            aadhaar: `12345678${9000 + barberMobileCount - 8000000000}`,
            pan: `ABCDE${1000 + barberMobileCount - 8000000000}F`,
            photo: `https://images.unsplash.com/photo-${[
              "1599351431202-1e0f0137899a",
              "1605497788044-5a32c7078486",
              "1599566150163-29194dcaad36",
              "1534528741775-53994a69daeb",
              "1507003211169-0a1dd7228f2d"
            ][bIdx]}?w=400`
          });
        }
      }
    }

    const sCount = await Salon.countDocuments({});
    const bCount = await Barber.countDocuments({});
    console.log(`Successfully seeded ${sCount} Salons and ${bCount} Barbers!`);
    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err);
    process.exit(1);
  }
};

seedData();
