const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MongoDB connection failed: MONGODB_URI is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);

    if (err.message.includes("querySrv")) {
      console.error(
        "Tip: Your DNS is refusing MongoDB Atlas SRV lookup. Use the direct mongodb:// seed-list URI in .env."
      );
    }

    if (
      err.message.includes("ECONNREFUSED") ||
      err.message.includes("timed out") ||
      err.message.includes("Server selection timed out")
    ) {
      console.error(
        "Tip: In MongoDB Atlas, add your current IP address under Network Access, then restart the backend."
      );
    }

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    console.warn("Server is running without MongoDB. Fix Atlas Network Access, then restart nodemon.");
  }
};
module.exports = connectDB;
