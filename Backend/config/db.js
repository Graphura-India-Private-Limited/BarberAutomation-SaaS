const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("MongoDB connected!");
    // Migration: Update any offline barbers to available
    const Barber = require("../models/Barber");
    const result = await Barber.updateMany({ status: "offline" }, { status: "available" });
    if (result.modifiedCount > 0) {
      console.log(`Migrated ${result.modifiedCount} offline barbers to available.`);
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
