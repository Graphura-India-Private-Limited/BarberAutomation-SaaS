const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const queueController = require("./controllers/queueController");
const ownerController = require("./controllers/ownerController");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const salonId = "6a3d2c59e03e2d2985d6a35d";

  // Mock req and res for queueController.getSalonQueue
  const req1 = { params: { salon_id: salonId } };
  const res1 = {
    status: function(code) {
      console.log(`getSalonQueue status: ${code}`);
      return this;
    },
    json: function(data) {
      console.log("getSalonQueue JSON success:", data.success);
      if (data.queue) {
        console.log(`getSalonQueue queue length: ${data.queue.length}`);
        data.queue.forEach(q => console.log(`  Entry ID: ${q._id}, Barber: ${q.barber_id ? q.barber_id.name : null}, Status: ${q.status}`));
      } else {
        console.log("getSalonQueue JSON error:", data.message);
      }
    }
  };

  console.log("\nCalling getSalonQueue...");
  try {
    await queueController.getSalonQueue(req1, res1, (err) => console.error("getSalonQueue next error:", err));
  } catch (err) {
    console.error("getSalonQueue throw error:", err);
  }

  // Mock req and res for ownerController.getOwnerDashboardStats
  const req2 = { params: { salon_id: salonId } };
  const res2 = {
    status: function(code) {
      console.log(`getOwnerDashboardStats status: ${code}`);
      return this;
    },
    json: function(data) {
      console.log("getOwnerDashboardStats JSON success:", data.success);
      if (data.success) {
        console.log(`  Barbers: ${data.barbers ? data.barbers.length : 0}`);
      } else {
        console.log("getOwnerDashboardStats JSON error:", data.message);
      }
    }
  };

  console.log("\nCalling getOwnerDashboardStats...");
  try {
    await ownerController.getOwnerDashboardStats(req2, res2);
  } catch (err) {
    console.error("getOwnerDashboardStats throw error:", err);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
