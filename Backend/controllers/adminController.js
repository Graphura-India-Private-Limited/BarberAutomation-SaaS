const bcrypt = require("bcryptjs");
const Salon = require("../models/Salon");
const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Barber = require("../models/Barber");
const Review = require("../models/Review");
const Service = require("../models/Service");
const Admin = require("../models/Admin");
const Queue = require("../models/Queue");
const BreakRequest = require("../models/BreakRequest");
const ApprovalRequest = require("../models/ApprovalRequest");

// @desc    Get global platform metrics
// @route   GET /api/admin/global-metrics
// @access  Private (Admin)
exports.getGlobalMetrics = async (req, res) => {
  try {
    const { state } = req.query;
    let matchQuery = {};
    let salonQuery = {};
    if (state && state !== "All" && state !== "All India") {
      salonQuery.state = state;
      const salonIds = await Salon.find({ state }).distinct("_id");
      matchQuery.salon_id = { $in: salonIds };
    }

    const totalSalons = await Salon.countDocuments(salonQuery);
    let totalUsers;
    if (state && state !== "All" && state !== "All India") {
      const activeUserIds = await Booking.find(matchQuery).distinct("customer_id");
      totalUsers = await Customer.countDocuments({ _id: { $in: activeUserIds } });
    } else {
      totalUsers = await Customer.countDocuments();
    }

    const peakHoursData = await Booking.aggregate([
      { $match: matchQuery },
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
      { $match: matchQuery },
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
    const { state } = req.query;
    let salonQuery = {};
    let barberQuery = {};
    let customerQuery = {};

    if (state && state !== "All" && state !== "All India") {
      salonQuery.state = state;
      const salonIds = await Salon.find({ state }).distinct("_id");
      barberQuery.salon_id = { $in: salonIds };
      
      const activeUserIds = await Booking.find({ salon_id: { $in: salonIds } }).distinct("customer_id");
      customerQuery._id = { $in: activeUserIds };
    }

    const salons = await Salon.find(salonQuery, "salon_name owner_name email max_barbers_limit status state");
    const barbers = await Barber.find(barberQuery, "name email phone salon_id status");
    const customers = await Customer.find(customerQuery, "name phone email created_at");

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
    const { state } = req.query;
    let customerQuery = {};
    let salonQuery = { status: "approved" };
    let bookingQuery = {};
    let paymentMatch = { status: "SUCCESS" };

    if (state && state !== "All" && state !== "All India") {
      salonQuery.state = state;
      const salonIds = await Salon.find({ state }).distinct("_id");
      bookingQuery.salon_id = { $in: salonIds };
      paymentMatch.salon_id = { $in: salonIds };
      
      const customerIds = await Booking.find({ salon_id: { $in: salonIds } }).distinct("customer_id");
      customerQuery._id = { $in: customerIds };
    }

    const [customers, salons, bookings, payments] = await Promise.all([
      Customer.countDocuments(customerQuery),
      Salon.countDocuments(salonQuery),
      Booking.countDocuments(bookingQuery),
      Payment.aggregate([{ $match: paymentMatch }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
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
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      query.state = state;
    }
    const salons = await Salon.find(query).sort({ created_at: -1 });
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
    
    if (status === "approved" && salon) {
      // Check if services are already created for this salon
      const existingServices = await Service.find({ salon_id: salon._id });
      if (existingServices.length === 0) {
        const serviceRegistry = {
          // Men's Services (40)
          "classic executive cut": { category: "men", duration: 35 },
          "modern fade (skin/low/drop)": { category: "men", duration: 40 },
          "premium keratin infusion": { category: "men", duration: 90 },
          "indian wedding grooming": { category: "men", duration: 60 },
          "kids' style cut": { category: "men", duration: 25 },
          "slick back classic pompadour": { category: "men", duration: 45 },
          "buzz cut & edge-up": { category: "men", duration: 20 },
          "textured crop fade": { category: "men", duration: 40 },
          "bollywood premium styling": { category: "men", duration: 45 },
          "scalp detox & cut combo": { category: "men", duration: 50 },

          "beard sculpting": { category: "men", duration: 30 },
          "royal shave ritual": { category: "men", duration: 40 },
          "beard hydration & wash": { category: "men", duration: 25 },
          "mustache styling & trim": { category: "men", duration: 15 },
          "charcoal beard softening": { category: "men", duration: 30 },
          "signature hot towel shave": { category: "men", duration: 30 },
          "beard color touch-up": { category: "men", duration: 35 },
          "indian royal beard styling": { category: "men", duration: 45 },
          "detox clay beard mask": { category: "men", duration: 30 },
          "classic clean shave": { category: "men", duration: 20 },

          "gentleman's facial": { category: "men", duration: 45 },
          "scalp revitalize massage": { category: "men", duration: 30 },
          "indian ayurvedic head massage": { category: "men", duration: 35 },
          "detoxifying charcoal mask": { category: "men", duration: 30 },
          "premium face & neck massage": { category: "men", duration: 30 },
          "tan removal peel-off mask": { category: "men", duration: 25 },
          "anti-stress neck & shoulder rub": { category: "men", duration: 20 },
          "hydrating aloe vera facial": { category: "men", duration: 40 },
          "ice cool mint scalp massage": { category: "men", duration: 25 },
          "aromatherapy facial spa": { category: "men", duration: 50 },

          "grey blending": { category: "men", duration: 60 },
          "global hair highlight": { category: "men", duration: 75 },
          "beard global coloring": { category: "men", duration: 40 },
          "root touch-up (men)": { category: "men", duration: 45 },
          "fashion streaks (per streak)": { category: "men", duration: 30 },
          "ammonia-free organic color": { category: "men", duration: 60 },
          "premium beard glossing": { category: "men", duration: 30 },
          "platinum blonde highlights": { category: "men", duration: 90 },
          "natural henna treatment": { category: "men", duration: 60 },
          "mustache & beard color combo": { category: "men", duration: 50 },

          // Women's Services (40)
          "precision cut & blow dry": { category: "women", duration: 60 },
          "bridal style & updo": { category: "women", duration: 90 },
          "couture hair styling (curling/straightening)": { category: "women", duration: 45 },
          "layered cut & blowout": { category: "women", duration: 60 },
          "creative hair makeover": { category: "women", duration: 75 },
          "express hair wash & blow dry": { category: "women", duration: 30 },
          "kids girls styling & cut": { category: "women", duration: 35 },
          "bollywood signature blowout": { category: "women", duration: 50 },
          "anti-frizz hair styling": { category: "women", duration: 40 },
          "premium hot iron styling": { category: "women", duration: 50 },

          "global hair coloring": { category: "women", duration: 100 },
          "signature balayage": { category: "women", duration: 150 },
          "ammonia-free root touchup": { category: "women", duration: 45 },
          "ombre hair transformation": { category: "women", duration: 160 },
          "fashion color streaks (3 foils)": { category: "women", duration: 50 },
          "blonde highlights accent": { category: "women", duration: 90 },
          "indian henna pack application": { category: "women", duration: 70 },
          "shine toner & color glaze": { category: "women", duration: 60 },
          "full global highlights": { category: "women", duration: 180 },
          "crown area highlights touch-up": { category: "women", duration: 90 },

          "organic oil head massage": { category: "women", duration: 30 },
          "hydrating hair spa": { category: "women", duration: 50 },
          "therapeutic scalp cleansing": { category: "women", duration: 45 },
          "relaxing neck & back therapy": { category: "women", duration: 35 },
          "anti-dandruff scalp treatment": { category: "women", duration: 50 },
          "intense nourishing cream spa": { category: "women", duration: 60 },
          "ayurvedic hair vitality ritual": { category: "women", duration: 70 },
          "detoxifying charcoal spa": { category: "women", duration: 50 },
          "deep moisture oil therapy": { category: "women", duration: 40 },
          "aromatic scalp soothing treatment": { category: "women", duration: 45 },

          "cysteine smoothing treatment": { category: "women", duration: 180 },
          "advanced keratin therapy": { category: "women", duration: 120 },
          "olaplex damage repair": { category: "women", duration: 60 },
          "pro-keratin shine therapy": { category: "women", duration: 110 },
          "anti-hairfall laser therapy": { category: "women", duration: 90 },
          "biotin nourishing infusion": { category: "women", duration: 80 },
          "volume-boost root treatment": { category: "women", duration: 45 },
          "organic frizz-free smoothing": { category: "women", duration: 150 },
          "silk protein glazing": { category: "women", duration: 70 },
          "scalp hydradermie treatment": { category: "women", duration: 60 },

          // Addon Services (30)
          "aromatherapy scalp massage": { category: "addon", duration: 20 },
          "acupressure shoulder relief": { category: "addon", duration: 25 },
          "charcoal beard detox": { category: "addon", duration: 20 },
          "relaxing foot reflexology": { category: "addon", duration: 20 },
          "warm herbal oil champo": { category: "addon", duration: 15 },
          "quick eye stress relief": { category: "addon", duration: 10 },
          "face roller massage": { category: "addon", duration: 10 },
          "deep back relief": { category: "addon", duration: 25 },
          "mint cooling champo": { category: "addon", duration: 20 },
          "head & temples rub": { category: "addon", duration: 15 },

          "deep conditioning mask": { category: "addon", duration: 30 },
          "express keratin booster": { category: "addon", duration: 40 },
          "instant bond-repair shield": { category: "addon", duration: 30 },
          "anti-frizz serum infusion": { category: "addon", duration: 20 },
          "citrus scalp scrub": { category: "addon", duration: 25 },
          "protein nourishing spray": { category: "addon", duration: 15 },
          "leave-in moroccan argan shot": { category: "addon", duration: 15 },
          "volumizing root boost": { category: "addon", duration: 20 },
          "scalp cooling serum ampoule": { category: "addon", duration: 15 },
          "split-end prevention treatment": { category: "addon", duration: 20 },

          "premium shine glaze / toner": { category: "addon", duration: 45 },
          "silver / grey glossing": { category: "addon", duration: 30 },
          "gold highlights accents (2 foils)": { category: "addon", duration: 30 },
          "color protect lock sealant": { category: "addon", duration: 20 },
          "hair gloss & lusterspa": { category: "addon", duration: 30 },
          "hair gloss & luster spa": { category: "addon", duration: 30 },
          "copper / caramel glaze refresher": { category: "addon", duration: 35 },
          "fashion streaks booster": { category: "addon", duration: 20 },
          "root shadow blending": { category: "addon", duration: 30 },
          "ammonia-free color gloss": { category: "addon", duration: 25 },
          "balayage glow booster": { category: "addon", duration: 30 }
        };

        for (const serviceName of salon.services_offered) {
          const lower = serviceName.toLowerCase().trim();
          let matched = serviceRegistry[lower];
          let category = "men";
          let duration = 30;

          if (matched) {
            category = matched.category;
            duration = matched.duration;
          } else {
            // fallback heuristic logic
            if (lower.includes('shave') && lower.includes('haircut')) {
              category = 'men';
              duration = 35;
            } else if (lower.includes('shave')) {
              category = 'men';
              duration = 15;
            } else if (lower.includes('beard')) {
              category = 'men';
              duration = 10;
            } else if (lower.includes('color') || lower.includes('highlight') || lower.includes('glaze') || lower.includes('balayage')) {
              category = 'men';
              duration = 60;
            } else if (lower.includes('kids') || lower.includes('child')) {
              category = 'men';
              duration = 15;
            } else if (lower.includes('massage') || lower.includes('relief') || lower.includes('scrub')) {
              category = 'addon';
              duration = 20;
            } else if (lower.includes('mask') || lower.includes('booster') || lower.includes('shield') || lower.includes('infusion')) {
              category = 'addon';
              duration = 25;
            }
          }

          let price = 0;
          if (salon.service_prices) {
            if (typeof salon.service_prices.get === "function") {
              price = salon.service_prices.get(serviceName) || salon.service_prices.get(serviceName.toLowerCase()) || 0;
            } else {
              price = salon.service_prices[serviceName] || salon.service_prices[serviceName.toLowerCase()] || 0;
            }
          }
          if (!price) {
            price = salon.basic_pricing || 150;
          }
          
          await Service.create({
            salon_id: salon._id,
            name: serviceName,
            category: category,
            price: Number(price),
            duration: duration,
            is_active: true
          });
        }
      }
    }

    res.json({ success: true, salon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a salon
// @route   DELETE /api/admin/salon/:id
// @access  Private (Admin)
exports.deleteSalon = async (req, res) => {
  try {
    const salonId = req.params.id;
    // 1. Delete the salon
    const deletedSalon = await Salon.findByIdAndDelete(salonId);
    if (!deletedSalon) {
      return res.status(404).json({ success: false, message: "Salon not found" });
    }

    // Find all barbers of this salon to clean up break requests
    const barbers = await Barber.find({ salon_id: salonId }, "_id");
    const barberIds = barbers.map(b => b._id);

    // 2. Delete break requests associated with these barbers
    await BreakRequest.deleteMany({ barber_id: { $in: barberIds } });

    // 3. Delete all barbers associated with this salon
    await Barber.deleteMany({ salon_id: salonId });

    // 4. Delete all services associated with this salon
    await Service.deleteMany({ salon_id: salonId });

    // 5. Delete bookings associated with this salon
    await Booking.deleteMany({ salon_id: salonId });

    // 6. Delete payments associated with this salon
    await Payment.deleteMany({ salon_id: salonId });

    // 7. Delete queues associated with this salon
    await Queue.deleteMany({ salon_id: salonId });

    // 8. Delete reviews associated with this salon
    await Review.deleteMany({ salon_id: salonId });

    res.json({ success: true, message: "Salon and all its associated data deleted successfully" });
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
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      const customerIds = await Booking.find({ salon_id: { $in: salonIds } }).distinct("customer_id");
      query._id = { $in: customerIds };
    }
    const customers = await Customer.find(query).sort({ created_at: -1 });
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
    const { state } = req.query;
    let query = { is_active: true };
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }
    const barbers = await Barber.find(query).populate("salon_id", "salon_name address").sort({ created_at: -1 });
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
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }
    const bookings = await Booking.find(query)
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
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }
    const services = await Service.find(query).populate("salon_id", "salon_name").sort({ created_at: -1 });
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
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }
    const payments = await Payment.find(query)
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .sort({ created_at: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══ REVIEWS ══ */

// @desc    Get all reviews (including booking feedback)
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getAllReviews = async (req, res) => {
  try {
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }

    const reviews = await Review.find(query)
      .populate("customer_id", "name mobile")
      .populate("salon_id", "salon_name")
      .populate("barber_id", "name")
      .sort({ created_at: -1 });

    const BookingFeedback = require("../models/BookingFeedback");
    const bookingFeedbacks = await BookingFeedback.find(query)
      .populate("customer_id", "name mobile")
      .populate("booking_id")
      .sort({ created_at: -1 });

    res.json({ success: true, reviews, bookingFeedbacks });
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

// @desc    Delete booking feedback directly
// @route   DELETE /api/admin/booking-feedback/:id
// @access  Private (Admin)
exports.deleteBookingFeedback = async (req, res) => {
  try {
    const BookingFeedback = require("../models/BookingFeedback");
    await BookingFeedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking feedback removed" });
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

/* ══ APPROVAL REQUESTS ══ */

// @desc    Get all change approval requests
// @route   GET /api/admin/approval-requests
// @access  Private (Admin)
exports.getApprovalRequests = async (req, res) => {
  try {
    const { state } = req.query;
    let query = {};
    if (state && state !== "All" && state !== "All India") {
      const salonIds = await Salon.find({ state }).distinct("_id");
      query.salon_id = { $in: salonIds };
    }
    const requests = await ApprovalRequest.find(query).sort({ created_at: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve or Reject a change request
// @route   PUT /api/admin/approval-request/:id/action
// @access  Private (Admin)
exports.handleApprovalRequestAction = async (req, res) => {
  const { action, admin_note } = req.body; // action: "approved" or "rejected"
  try {
    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action. Must be approved or rejected." });
    }

    const request = await ApprovalRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request is already resolved" });
    }

    request.status = action;
    request.admin_note = admin_note || "";
    request.resolved_at = new Date();
    await request.save();

    if (action === "approved") {
      // Apply proposed changes to the live Salon document
      const proposedChanges = {};
      request.proposed_changes.forEach((value, key) => {
        proposedChanges[key] = value;
      });
      await Salon.findByIdAndUpdate(request.salon_id, proposedChanges);
    }

    res.json({ success: true, message: `Request successfully ${action}`, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
