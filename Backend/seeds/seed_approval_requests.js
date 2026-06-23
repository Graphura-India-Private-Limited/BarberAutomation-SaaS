require("dotenv").config();
const mongoose = require("mongoose");
const Salon = require("../models/Salon");
const ApprovalRequest = require("../models/ApprovalRequest");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/BarberAutomation";

const seedRequests = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing approval requests
    await ApprovalRequest.deleteMany({});
    console.log("Cleared existing approval requests.");

    const salons = await Salon.find({});
    if (salons.length === 0) {
      console.log("No salons found. Run main seeds first.");
      process.exit(0);
    }

    const requests = [];

    // Request 1: Pending Address Change from Salon 1
    const salon1 = salons[0];
    requests.push({
      salon_id: salon1._id,
      salon_name: salon1.salon_name,
      owner_name: salon1.owner_name || "Owner A",
      request_type: "address_change",
      proposed_changes: {
        address: "GF-14, Premium Shivalik Plaza, Near IIM Ahmedabad, Gujarat 380015",
        state: "Gujarat",
        latitude: 23.0315,
        longitude: 72.5401
      },
      current_values: {
        address: salon1.address || "123, Old Street, Ahmedabad, Gujarat 380001",
        state: salon1.state || "Gujarat",
        latitude: salon1.latitude || 23.0225,
        longitude: salon1.longitude || 72.5714
      },
      status: "pending",
      created_at: new Date(Date.now() - 2 * 3600 * 1000) // 2 hours ago
    });

    // Request 2: Approved Limit Increase from Salon 2 (if exists) or Salon 1
    const salon2 = salons[1] || salon1;
    requests.push({
      salon_id: salon2._id,
      salon_name: salon2.salon_name,
      owner_name: salon2.owner_name || "Owner B",
      request_type: "limit_increase",
      proposed_changes: {
        number_of_barbers: 8,
        basic_pricing: 650
      },
      current_values: {
        number_of_barbers: salon2.number_of_barbers || 5,
        basic_pricing: salon2.basic_pricing || 500
      },
      status: "approved",
      admin_note: "Verified salon physical dimensions; capacity can support 8 chairs.",
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000), // 3 days ago
      resolved_at: new Date(Date.now() - 2 * 24 * 3600 * 1000)
    });

    // Request 3: Rejected Profile Update
    const salon3 = salons[2] || salon1;
    requests.push({
      salon_id: salon3._id,
      salon_name: salon3.salon_name,
      owner_name: salon3.owner_name || "Owner C",
      request_type: "profile_update",
      proposed_changes: {
        salon_name: "Super Luxury Salon & Spa Lounge"
      },
      current_values: {
        salon_name: salon3.salon_name
      },
      status: "rejected",
      admin_note: "Name request does not match salon registration certificate name.",
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000), // 5 days ago
      resolved_at: new Date(Date.now() - 4 * 24 * 3600 * 1000)
    });

    // Request 4: General query/complaint request
    requests.push({
      salon_id: salon1._id,
      salon_name: salon1.salon_name,
      owner_name: salon1.owner_name || "Owner A",
      request_type: "general_query",
      proposed_changes: {
        query_text: "Our internet connection went down, how can we queue check-in users offline from the cashier counter?"
      },
      current_values: {},
      status: "pending",
      created_at: new Date(Date.now() - 1 * 3600 * 1000) // 1 hour ago
    });

    await ApprovalRequest.insertMany(requests);
    console.log("Mock approval requests successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding approval requests:", err);
    process.exit(1);
  }
};

seedRequests();
