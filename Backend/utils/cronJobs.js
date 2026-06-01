const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const mailer = require("./mailer");

// Monthly rebooking reminder script
const checkMonthlyReminders = async () => {
  console.log("[Cron Job] Running daily monthly rebook reminder scan...");
  try {
    const customers = await Customer.find({ monthly_reminders: true });
    
    for (const customer of customers) {
      // Find all bookings for this customer
      const bookings = await Booking.find({ customer_id: customer._id })
        .populate("barber_id", "name")
        .sort({ created_at: -1 });

      const upcomingOrPending = bookings.some(
        (b) => b.status === "upcoming" || b.status === "pending"
      );

      // If they already have an upcoming or pending booking, skip them
      if (upcomingOrPending) continue;

      // Find the latest completed booking
      const latestCompleted = bookings.find((b) => b.status === "completed");
      if (!latestCompleted) continue;

      // Check if it was exactly 30 days ago
      const latestDate = new Date(latestCompleted.created_at || latestCompleted.slot_time);
      const diffTime = Math.abs(new Date() - latestDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If it has been exactly 30 days, trigger the email
      if (diffDays === 30) {
        const lastBarberName = latestCompleted.barber_id?.name || "Barber Ajay";
        console.log(`[Cron Job] Customer ${customer.name} qualifies for 30-day reminder. Triggering email.`);
        await mailer.sendOneMonthReminderEmail(customer, lastBarberName);
      }
    }
  } catch (err) {
    console.error("[Cron Job Error] Failed to run monthly rebook reminder check:", err.message);
  }
};

// Initialize cron scheduler
exports.initCron = () => {
  // Run once immediately on start (simulated check)
  setTimeout(() => {
    checkMonthlyReminders();
  }, 5000);

  // Run every 24 hours
  const INTERVAL_24H = 24 * 60 * 60 * 1000;
  setInterval(() => {
    checkMonthlyReminders();
  }, INTERVAL_24H);

  console.log("[Cron System] Scheduled daily monthly rebook checks successfully (24-hour interval).");
};

// Manual trigger for testing
exports.triggerManualCheck = async () => {
  return checkMonthlyReminders();
};
