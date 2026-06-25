const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const Queue = require("./models/Queue");
const Barber = require("./models/Barber");
const Booking = require("./models/Booking");
const ownerController = require("./controllers/ownerController");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Find any unassigned waiting queue entry first
  let q = await Queue.findOne({ barber_id: null, status: "waiting" });
  if (!q) {
    console.log("No unassigned waiting queue entry found. Falling back to findById.");
    const targetId = "6a3d2c81e03e2d2985d6a3d0";
    q = await Queue.findById(targetId);
  }
  if (!q) {
    console.log("No queue entry found.");
    await mongoose.disconnect();
    return;
  }

  console.log(`\nFound queue entry to auto-assign: ID=${q._id}, status=${q.status}, barber_id=${q.barber_id}`);

  // Mock req and res for ownerController.autoAssignQueueEntry
  const req = {
    params: { queue_id: q._id.toString() }
  };
  const res = {
    status: function(code) {
      console.log(`Response status code: ${code}`);
      return this;
    },
    json: function(data) {
      console.log("Response JSON:", data);
    }
  };

  console.log("\nExecuting autoAssignQueueEntry...");
  await ownerController.autoAssignQueueEntry(req, res);

  // Fetch immediately
  let qUpdated = await Queue.findById(q._id);
  console.log(`Immediately after assignment: barber_id=${qUpdated.barber_id}`);

  // Wait 4 seconds and fetch again to see if it reverted
  console.log("\nWaiting 4 seconds...");
  await new Promise(resolve => setTimeout(resolve, 4000));

  qUpdated = await Queue.findById(q._id);
  console.log(`After 4 seconds: barber_id=${qUpdated.barber_id}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
