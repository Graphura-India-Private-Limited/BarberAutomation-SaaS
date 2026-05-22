const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const Salon    = require("../models/Salon");
const Customer = require("../models/Customer");
const Booking  = require("../models/Booking");
const Payment  = require("../models/Payment");
const Barber   = require("../models/Barber");
const Review   = require("../models/Review");
const Service  = require("../models/Service");
const Admin    = require("../models/Admin");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ══ STATS ══ */
router.get("/global-metrics", async (req, res) => {
  try {
    // 1. Core Platform Metrics Count
    const totalSalons = await Salon.countDocuments();
    const totalUsers = await Customer.countDocuments();

    // 2. Aggregate Peak Usage Hours (Based on Booking Time data)
    const peakHoursData = await Booking.aggregate([
      {
        $project: {
          // Extracts the numeric hour from your booking time slot/created timestamp string
          hour: { $hour: "$created_at" } 
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 } // Top 5 busiest hours
    ]);

    // Format peak hours nicely for charts (e.g., "14" becomes "02:00 PM")
    const formattedPeakHours = peakHoursData.map(item => {
      const hr = item._id ?? 12;
      const ampm = hr >= 12 ? "PM" : "AM";
      const displayHour = hr % 12 === 0 ? 12 : hr % 12;
      return {
        hourString: `${displayHour}:00 ${ampm}`,
        bookingsCount: item.count
      };
    });

    // 3. High-Performing Salons (Top 3 shops sorted by total bookings processed)
    const topSalonsData = await Booking.aggregate([
      {
        $group: {
          _id: "$salon_id",
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "salons", // Matches your exact salon collection lower-case name
          localField: "_id",
          foreignField: "_id",
          as: "salonDetails"
        }
      },
      { $unwind: "$salonDetails" },
      {
        $project: {
          salonName: "$salonDetails.salon_name",
          ownerName: "$salonDetails.owner_name",
          totalBookings: 1
        }
      }
    ]);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalSalons,
        peakHours: formattedPeakHours,
        highPerformingSalons: topSalonsData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/users-overview", async (req, res) => {
  try {
    const salons = await Salon.find({}, "salon_name owner_name email max_barbers_limit status");
    const barbers = await Barber.find({}, "name email phone salon_id status");
    const customers = await Customer.find({}, "name phone email created_at");

    res.json({
      success: true,
      data: { salons, barbers, customers }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Update the barber capacity limit for a shop branch
router.put("/salon-limit/:id", async (req, res) => {
  const { max_barbers_limit } = req.body;
  try {
    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      { max_barbers_limit: Number(max_barbers_limit) },
      { new: true }
    );
    if (!updatedSalon) return res.status(404).json({ success: false, message: "Salon profile not found" });
    
    res.json({ success: true, data: updatedSalon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [customers, salons, bookings, payments] = await Promise.all([
      Customer.countDocuments(),
      Salon.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: "captured" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    res.json({ success: true, stats: { customers, salons, bookings, revenue: payments[0]?.total || 0 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ SALONS ══ */
router.get("/salons", protect, adminOnly, async (req, res) => {
  try {
    const salons = await Salon.find().sort({ created_at: -1 });
    res.json({ success: true, salons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put("/salon/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const updates = {
      status,
      rejection_reason: status === "rejected" ? rejection_reason || "Rejected by admin" : "",
      approved_at: status === "approved" ? new Date() : null,
    };
    const salon = await Salon.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, salon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ CUSTOMERS ══ */
router.get("/customers", protect, adminOnly, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });
    res.json({ success: true, customers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put("/customer/:id/block", protect, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { blocked: req.body.blocked }, { new: true });
    res.json({ success: true, customer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete("/customer/:id", protect, adminOnly, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ BARBERS ══ */
router.get("/barbers", protect, adminOnly, async (req, res) => {
  try {
    const barbers = await Barber.find({ is_active: true }).populate("salon_id", "salon_name address").sort({ created_at: -1 });
    res.json({ success: true, barbers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post("/barber", protect, adminOnly, async (req, res) => {
  try {
    const { name, mobile, password, specialization, experience, salon_id } = req.body;
    const exists = await Barber.findOne({ mobile });
    if (exists) return res.status(400).json({ success: false, message: "Mobile already exists" });
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({ name, mobile, password_hash, specialization: specialization || "", experience: Number(experience) || 0, salon_id });
    res.status(201).json({ success: true, barber, message: "Barber added!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put("/barber/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, barber });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete("/barber/:id", protect, adminOnly, async (req, res) => {
  try {
    await Barber.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Removed" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ BOOKINGS ══ */
router.get("/bookings", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, bookings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put("/booking/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ SERVICES ══ */
router.get("/services", protect, adminOnly, async (req, res) => {
  try {
    const services = await Service.find().populate("salon_id", "salon_name").sort({ created_at: -1 });
    res.json({ success: true, services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post("/service", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put("/service/:id", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, service });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete("/service/:id", protect, adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ PAYMENTS ══ */
router.get("/payments", protect, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .sort({ created_at: -1 });
    res.json({ success: true, payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ REVIEWS ══ */
router.get("/reviews", protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete("/review/:id", protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══ CREATE ADMIN ══ */
router.post("/create", async (req, res) => {
  try {
    const { email, password, mpin, mobile } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Already exists" });
    const password_hash = await bcrypt.hash(password, 10);
    const mpin_hash     = await bcrypt.hash(mpin, 10);
    await Admin.create({ email, mobile: mobile || "", password_hash, mpin_hash });
    res.json({ success: true, message: "Admin created!" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
