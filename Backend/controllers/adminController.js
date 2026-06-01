const bcrypt = require("bcryptjs");
const Salon = require("../models/Salon");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Barber = require("../models/Barber");
const Review = require("../models/Review");
const Service = require("../models/Service");
const Admin = require("../models/Admin");
const Newsletter = require("../models/Newsletter");

// @desc    Get global platform metrics
// @route   GET /api/admin/global-metrics
// @access  Private (Admin)
exports.getGlobalMetrics = async (req, res) => {
  try {
    const totalSalons = await Salon.countDocuments();
    const totalUsers = await Customer.countDocuments();

    const peakHoursData = await Booking.aggregate([
      {
        $project: {
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
      { $limit: 5 }
    ]);

    const formattedPeakHours = peakHoursData.map(item => {
      const hr = item._id ?? 12;
      const ampm = hr >= 12 ? "PM" : "AM";
      const displayHour = hr % 12 === 0 ? 12 : hr % 12;
      return {
        hourString: `${displayHour}:00 ${ampm}`,
        bookingsCount: item.count
      };
    });

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
          from: "salons",
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
};

// @desc    Get system-wide overview of all users (salons, barbers, customers)
// @route   GET /api/admin/users-overview
// @access  Private (Admin)
exports.getUsersOverview = async (req, res) => {
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
};

// @desc    Update barber limit for a salon
// @route   PUT /api/admin/salon-limit/:id
// @access  Private (Admin)
exports.updateSalonLimit = async (req, res) => {
  const { max_barbers_limit } = req.body;
  try {
    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      { max_barbers_limit: Number(max_barbers_limit) },
      { new: true }
    );
    if (!updatedSalon) {
      return res.status(404).json({ success: false, message: "Salon profile not found" });
    }
    
    res.json({ success: true, data: updatedSalon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get quick system stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const [customers, salons, bookings, payments] = await Promise.all([
      Customer.countDocuments(),
      Salon.countDocuments({ status: "approved" }),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: "captured" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    res.json({ success: true, stats: { customers, salons, bookings, revenue: payments[0]?.total || 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ SALONS ══ */

// @desc    Get all salons
// @route   GET /api/admin/salons
// @access  Private (Admin)
exports.getAllSalons = async (req, res) => {
  try {
    const salons = await Salon.find().sort({ created_at: -1 });
    res.json({ success: true, salons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update salon approval status
// @route   PUT /api/admin/salon/:id/status
// @access  Private (Admin)
exports.updateSalonStatus = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const updates = {
      status,
      rejection_reason: status === "rejected" ? rejection_reason || "Rejected by admin" : "",
      approved_at: status === "approved" ? new Date() : null,
    };
    const salon = await Salon.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, salon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ CUSTOMERS ══ */

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Block/Unblock customer account
// @route   PUT /api/admin/customer/:id/block
// @access  Private (Admin)
exports.blockCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { blocked: req.body.blocked }, { new: true });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a customer account
// @route   DELETE /api/admin/customer/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ BARBERS ══ */

// @desc    Get all active barbers
// @route   GET /api/admin/barbers
// @access  Private (Admin)
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find({ is_active: true }).populate("salon_id", "salon_name address").sort({ created_at: -1 });
    res.json({ success: true, barbers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add a new barber directly
// @route   POST /api/admin/barber
// @access  Private (Admin)
exports.addBarber = async (req, res) => {
  try {
    const { name, mobile, password, specialization, experience, salon_id } = req.body;
    const exists = await Barber.findOne({ mobile });
    if (exists) return res.status(400).json({ success: false, message: "Mobile already exists" });
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({
      name,
      mobile,
      password_hash,
      specialization: specialization || "",
      experience: Number(experience) || 0,
      salon_id
    });
    res.status(201).json({ success: true, barber, message: "Barber added!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update barber status directly
// @route   PUT /api/admin/barber/:id/status
// @access  Private (Admin)
exports.updateBarberStatus = async (req, res) => {
  try {
    const barber = await Barber.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, barber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Deactivate barber account directly
// @route   DELETE /api/admin/barber/:id
// @access  Private (Admin)
exports.deleteBarber = async (req, res) => {
  try {
    await Barber.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ BOOKINGS ══ */

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update booking status directly
// @route   PUT /api/admin/booking/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ SERVICES ══ */

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private (Admin)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("salon_id", "salon_name").sort({ created_at: -1 });
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new service directly
// @route   POST /api/admin/service
// @access  Private (Admin)
exports.addService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update service info directly
// @route   PUT /api/admin/service/:id
// @access  Private (Admin)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Soft delete a service directly
// @route   DELETE /api/admin/service/:id
// @access  Private (Admin)
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ PAYMENTS ══ */

// @desc    Get all captured/recorded payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .sort({ created_at: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ REVIEWS ══ */

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete review directly
// @route   DELETE /api/admin/review/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ CREATE ADMIN ══ */

// @desc    Create a new admin account (Internal alternative route)
// @route   POST /api/admin/create
// @access  Public
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, mpin, mobile } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Already exists" });
    const password_hash = await bcrypt.hash(password, 10);
    const mpin_hash = await bcrypt.hash(mpin, 10);
    await Admin.create({ email, mobile: mobile || "", password_hash, mpin_hash });
    res.json({ success: true, message: "Admin created!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ NEWSLETTER SUBSCRIBERS ══ */

// @desc    Get all newsletter subscribers
// @route   GET /api/admin/newsletter-subscribers
// @access  Private (Admin Only)
exports.getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json({ success: true, subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a newsletter subscriber
// @route   DELETE /api/admin/newsletter-subscribers/:id
// @access  Private (Admin Only)
exports.deleteNewsletterSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }
    res.json({ success: true, message: "Subscriber deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

