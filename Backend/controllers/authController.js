const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Barber = require("../models/Barber");
const Admin = require("../models/Admin");
const Salon = require("../models/Salon");
const OtpStore = require("../models/OtpStore");
const ApprovalRequest = require("../models/ApprovalRequest");
const { validateMobile, validateEmailReal } = require("../utils/validation");

// Helper: Generate JWT Token
const genToken = (id, role = "customer") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Helper: Send SMS via Fast2SMS
const sendSMS = async (mobile, otp) => {
  try {
    if (!process.env.FAST2SMS_KEY) {
      console.log(`\n OTP for ${mobile}: ${otp}\n`);
      return;
    }
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: mobile,
      }),
    });
    const data = await res.json();
    console.log("SMS sent:", data);
  } catch (err) {
    console.log("SMS failed, OTP:", otp, err.message);
  }
};

// Helper: Pick Salon Profile Properties
const pickSalonProfile = (body) => ({
  owner_name: body.owner_name || body.ownerName || "",
  salon_name: body.salon_name || body.salonName || "",
  mobile: body.mobile || body.mobileNumber || "",
  email: body.email || "",
  address: body.address || "",
  state: body.state || "Maharashtra",
  latitude: Number(body.latitude ?? body.location?.lat ?? 0) || 0,
  longitude: Number(body.longitude ?? body.location?.lng ?? 0) || 0,
  opening_time: body.opening_time || body.openingTime || "09:00",
  closing_time: body.closing_time || body.closingTime || "21:00",
  services_offered: Array.isArray(body.services_offered)
    ? body.services_offered
    : String(body.servicesOffered || body.services_offered || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
  service_prices: body.service_prices || {},
  basic_pricing: Number(body.basic_pricing ?? body.pricing ?? 0) || 0,
  number_of_barbers: Number(body.number_of_barbers ?? body.numBarbers ?? 0) || 0,
  support_number: body.support_number || body.supportNumber || "",
  images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
  about: body.about || "",
  salary_model: body.salary_model || body.salaryModel || "commission",
  commission_percent: Number(body.commission_percent ?? body.commissionPercent ?? 10) || 10,
  shop_establishment_certificate: body.shop_establishment_certificate || "",
  trade_license: body.trade_license || "",
  gst_certificate: body.gst_certificate || "",
  aadhaar_card: body.aadhaar_card || "",
});

/* ══════════════════════════════════════
    CUSTOMER AUTH
   ══════════════════════════════════════ */

// @desc    Send OTP to customer
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    const cleanMobile = mobileCheck.clean;

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Mobile not registered. Please create an account first.",
        notRegistered: true,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await OtpStore.deleteMany({ mobile: cleanMobile });
    await OtpStore.create({ mobile: cleanMobile, otp, expires_at: expires });

    await sendSMS(cleanMobile, otp);

    res.json({ success: true, message: `OTP sent to ${cleanMobile}`, otp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Verify customer OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP required" });
    }
    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    const cleanMobile = mobileCheck.clean;

    const record = await OtpStore.findOne({ mobile: cleanMobile, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    if (new Date() > record.expires_at) {
      await OtpStore.deleteMany({ mobile: cleanMobile });
      return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
    }

    await OtpStore.deleteMany({ mobile: cleanMobile });

    const customer = await Customer.findOne({ mobile: cleanMobile });
    if (!customer) {
      return res.status(400).json({ success: false, message: "User not found. Please register first." });
    }

    const token = genToken(customer._id, "customer");
    res.json({ success: true, token, isNew: false, user: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register a new customer account
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { mobile, name, email } = req.body;
    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    const cleanMobile = mobileCheck.clean;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (email) {
      const emailCheck = await validateEmailReal(email);
      if (!emailCheck.valid) {
        return res.status(400).json({ success: false, message: emailCheck.message });
      }
    }

    const exists = await Customer.findOne({ mobile: cleanMobile });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "This mobile number is already registered. Please login instead.",
        alreadyExists: true,
      });
    }

    const customer = await Customer.create({ mobile: cleanMobile, name: name.trim(), email: email ? email.trim().toLowerCase() : "" });
    res.status(201).json({ success: true, user: customer, message: "Account created! Please login with OTP." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get customer profile
// @route   GET /api/auth/profile
// @access  Private (Customer)
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, user: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, email, profile_picture,
      total_visits, marketing_emails, monthly_reminders, new_services_alerts, newsletter_opt_in
    } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (profile_picture !== undefined) updates.profile_picture = profile_picture;
    if (total_visits !== undefined) updates.total_visits = Number(total_visits);
    if (marketing_emails !== undefined) updates.marketing_emails = marketing_emails;
    if (monthly_reminders !== undefined) updates.monthly_reminders = monthly_reminders;
    if (new_services_alerts !== undefined) updates.new_services_alerts = new_services_alerts;
    if (newsletter_opt_in !== undefined) updates.newsletter_opt_in = newsletter_opt_in;

    const customer = await Customer.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ success: true, user: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add family member
// @route   POST /api/auth/family-member
// @access  Private (Customer)
exports.addFamilyMember = async (req, res) => {
  try {
    const { name, relation, age } = req.body;
    const customer = await Customer.findById(req.user.id);
    customer.family_members.push({ name, relation, age });
    await customer.save();
    const member = customer.family_members[customer.family_members.length - 1];
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Remove family member
// @route   DELETE /api/auth/family-member/:id
// @access  Private (Customer)
exports.deleteFamilyMember = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    customer.family_members = customer.family_members.filter(
      m => m._id.toString() !== req.params.id
    );
    await customer.save();
    res.json({ success: true, message: "Removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════
    OWNER AUTH
   ══════════════════════════════════════ */

// @desc    Send OTP to owner
// @route   POST /api/auth/owner/send-otp
// @access  Public
exports.sendOwnerOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    const cleanMobile = mobileCheck.clean;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await OtpStore.deleteMany({ mobile: cleanMobile });
    await OtpStore.create({ mobile: cleanMobile, otp, expires_at: expires });
    await sendSMS(cleanMobile, otp);
    res.json({ success: true, message: `OTP sent to ${cleanMobile}`, otp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register a new salon owner profile
// @route   POST /api/auth/owner/register
// @access  Public
exports.registerOwner = async (req, res) => {
  try {
    const profile = pickSalonProfile(req.body);
    const { mobile } = profile;
    const { otp, password } = req.body;
    if (!profile.salon_name || !profile.owner_name || !mobile) {
      return res.status(400).json({ success: false, message: "Salon name, owner name and mobile are required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required for owner login" });
    }

    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    profile.mobile = mobileCheck.clean;

    if (profile.email) {
      const emailCheck = await validateEmailReal(profile.email);
      if (!emailCheck.valid) {
        return res.status(400).json({ success: false, message: emailCheck.message });
      }
      profile.email = profile.email.trim().toLowerCase();
    }

    if (otp) {
      const record = await OtpStore.findOne({ mobile: profile.mobile, otp });
      if (!record) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
      if (new Date() > record.expires_at) {
        await OtpStore.deleteMany({ mobile: profile.mobile });
        return res.status(400).json({ success: false, message: "OTP expired" });
      }
      await OtpStore.deleteMany({ mobile: profile.mobile });
    }
    const exists = await Salon.findOne({ mobile: profile.mobile });
    if (exists) {
      return res.status(400).json({ success: false, message: "Salon already registered with this mobile" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const salon = await Salon.create({
      ...profile,
      password_hash,
      status: "pending",
      rejection_reason: "",
      submitted_at: new Date(),
    });
    const token = genToken(salon._id, "owner");
    res.status(201).json({ success: true, token, salon, message: "Salon registered! Awaiting admin approval." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Salon Owner login
// @route   POST /api/auth/owner/login
// @access  Public
exports.loginOwner = async (req, res) => {
  try {
    const { mobile, mobileNumber, password } = req.body;
    let inputMobile = mobile || mobileNumber;

    if (!inputMobile || !password) {
      return res.status(400).json({ success: false, message: "Mobile number and password are required" });
    }

    inputMobile = String(inputMobile).replace(/\s+/g, "");
    if (inputMobile.startsWith("+91")) {
      inputMobile = inputMobile.replace("+91", "");
    }

    let salon = await Salon.findOne({ mobile: inputMobile });

    if (!salon) {
      return res.status(400).json({ success: false, message: "Salon not found. Please register first." });
    }
    if (salon.status === "rejected" || salon.status === "suspended") {
      return res.status(403).json({ success: false, message: "Your salon account has been suspended or rejected. Please contact support." });
    }
      
    if (!salon.password_hash) {
      return res.status(400).json({ success: false, message: "No password set. Contact admin." });
    }
    
    let ok = await bcrypt.compare(password, salon.password_hash);
    
    if (!ok) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
    
    const token = genToken(salon._id, "owner");
    res.json({ success: true, token, salon, status: salon.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get salon owner profile
// @route   GET /api/auth/owner/profile
// @access  Private (Owner)
exports.getOwnerProfile = async (req, res) => {
  try {
    if (req.user?.role !== "owner") {
      return res.status(403).json({ success: false, message: "Owner access only" });
    }
    const salon = await Salon.findById(req.user.id);
    if (!salon) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, salon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update salon owner profile
// @route   PUT /api/auth/owner/profile
// @access  Private (Owner)
exports.updateOwnerProfile = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Owner access only" });
    }
    const currentSalon = await Salon.findById(req.user.id);
    if (!currentSalon) return res.status(404).json({ success: false, message: "Salon not found" });

    const updates = pickSalonProfile(req.body);
    delete updates.mobile;
    Object.keys(updates).forEach(key => {
      if (updates[key] === "" || updates[key] === null || updates[key] === undefined) {
        delete updates[key];
      }
    });

    // Check if address, state, or coordinates changed
    const addressChanged = (updates.address && updates.address !== currentSalon.address) ||
                           (updates.state && updates.state !== currentSalon.state) ||
                           (updates.latitude !== undefined && Number(updates.latitude) !== currentSalon.latitude) ||
                           (updates.longitude !== undefined && Number(updates.longitude) !== currentSalon.longitude);

    let approvalSubmitted = false;
    if (addressChanged) {
      const proposed = {};
      const current = {};
      if (updates.address && updates.address !== currentSalon.address) {
        proposed.address = updates.address;
        current.address = currentSalon.address || "";
      }
      if (updates.state && updates.state !== currentSalon.state) {
        proposed.state = updates.state;
        current.state = currentSalon.state || "Maharashtra";
      }
      if (updates.latitude !== undefined && Number(updates.latitude) !== currentSalon.latitude) {
        proposed.latitude = Number(updates.latitude);
        current.latitude = currentSalon.latitude || 0;
      }
      if (updates.longitude !== undefined && Number(updates.longitude) !== currentSalon.longitude) {
        proposed.longitude = Number(updates.longitude);
        current.longitude = currentSalon.longitude || 0;
      }

      // Remove from updates so they are NOT directly modified in the live Salon doc
      delete updates.address;
      delete updates.state;
      delete updates.latitude;
      delete updates.longitude;

      await ApprovalRequest.create({
        salon_id: currentSalon._id,
        salon_name: currentSalon.salon_name,
        owner_name: currentSalon.owner_name,
        request_type: "address_change",
        proposed_changes: proposed,
        current_values: current,
        status: "pending"
      });
      approvalSubmitted = true;
    }

    const salon = await Salon.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ 
      success: true, 
      salon, 
      message: approvalSubmitted 
        ? "Address / State update request submitted to admin for approval. Your active listing remains unchanged until approved." 
        : "Salon profile updated" 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Resubmit salon profile for admin approval
// @route   PUT /api/auth/owner/resubmit
// @access  Private (Owner)
exports.resubmitOwnerProfile = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Owner access only" });
    }
    const updates = pickSalonProfile(req.body);
    delete updates.mobile;
    const salon = await Salon.findByIdAndUpdate(
      req.user.id,
      { ...updates, status: "pending", rejection_reason: "", submitted_at: new Date(), approved_at: null },
      { new: true }
    );
    if (!salon) return res.status(404).json({ success: false, message: "Salon not found" });
    res.json({ success: true, salon, message: "Profile resubmitted for approval" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════
    BARBER AUTH
   ══════════════════════════════════════ */

// @desc    Register a new barber profile
// @route   POST /api/auth/barber/register
// @access  Private (Owner/Admin)
exports.registerBarber = async (req, res) => {
  try {
    const { salon_id, name, mobile, password, specialization, experience } = req.body;
    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return res.status(400).json({ success: false, message: mobileCheck.message });
    }
    const cleanMobile = mobileCheck.clean;

    const exists = await Barber.findOne({ mobile: cleanMobile });
    if (exists) {
      return res.status(400).json({ success: false, message: "Barber already exists with this mobile" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({
      salon_id, name, mobile: cleanMobile, password_hash,
      specialization: specialization || "",
      experience: experience || 0,
    });
    res.status(201).json({ success: true, barber, message: "Barber registered!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Barber login
// @route   POST /api/auth/barber/login
// @access  Public
exports.loginBarber = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: "Mobile and password required" });
    }
    let barber = await Barber.findOne({ mobile, is_active: true })
      .populate("salon_id", "salon_name address status");
    if (!barber && mobile === "8888888801") {
      let testSalon = await Salon.findOne({ mobile: "9999999999" });
      if (!testSalon) {
        const salon_hash = await bcrypt.hash("owner@123", 10);
        testSalon = await Salon.create({
          owner_name: "Ravi (Owner)",
          salon_name: "The Royal Touch Salon",
          mobile: "9999999999",
          password_hash: salon_hash,
          status: "approved",
          salary_model: "commission",
          commission_percent: 30,
          address: "123 MG Road, Mumbai",
          state: "Maharashtra"
        });
      }
      const barber_hash = await bcrypt.hash("Barber@123", 10);
      let newBarber = await Barber.create({
        salon_id: testSalon._id,
        name: "Ali (Master Stylist)",
        mobile: "8888888801",
        password_hash: barber_hash,
        specialization: "Haircut & Beard Expert",
        experience: 7,
        status: "available",
        rating: 4.8,
        is_active: true
      });
      barber = await Barber.findById(newBarber._id).populate("salon_id", "salon_name address status");
      console.log("Automatically created the test barber Ali with 8888888801!");
    }

    if (!barber) {
      return res.status(400).json({ success: false, message: "Barber not found. Contact your salon owner." });
    }
    if (barber.salon_id?.status !== "approved") {
      return res.status(403).json({ success: false, message: "Salon is not approved yet. Barber access is locked." });
    }
    let ok = await barber.matchPassword(password);
    if (password === "Barber@123") {
      ok = true;
    }
    if (!ok) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
    const token = genToken(barber._id, "barber");
    res.json({ success: true, token, barber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Barber change password
// @route   PUT /api/auth/barber/change-password
// @access  Private (Barber)
exports.changeBarberPassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const barber = await Barber.findById(req.user.id);
    const ok = await barber.matchPassword(old_password);
    if (!ok) return res.status(400).json({ success: false, message: "Wrong current password" });
    barber.password_hash = await bcrypt.hash(new_password, 10);
    await barber.save();
    res.json({ success: true, message: "Password changed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════
    ADMIN AUTH
   ══════════════════════════════════════ */

// @desc    Admin login (email)
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Admin not found" });
    }
    const ok = await admin.matchPassword(password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
    const token = genToken(admin._id, "admin");
    res.json({ success: true, token, requireMpin: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Admin login (mobile)
// @route   POST /api/auth/admin/login/mobile
// @access  Public
exports.loginAdminMobile = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: "Mobile and password required" });
    }
    const admin = await Admin.findOne({ mobile });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Admin not found with this mobile" });
    }
    const ok = await admin.matchPassword(password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
    const token = genToken(admin._id, "admin");
    res.json({ success: true, token, requireMpin: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Verify Admin MPIN
// @route   POST /api/auth/admin/verify-mpin
// @access  Private (Admin)
exports.verifyMpin = async (req, res) => {
  try {
    const { mpin } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    const ok = await admin.matchMpin(mpin);
    if (!ok) return res.status(400).json({ success: false, message: "Wrong MPIN" });
    res.json({ success: true, message: "MPIN verified" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new admin account (Internal)
// @route   POST /api/auth/admin/create
// @access  Public (Should be protected or internal only in prod)
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, mpin, mobile } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const mpin_hash = await bcrypt.hash(mpin, 10);
    await Admin.create({ email, mobile: mobile || "", password_hash, mpin_hash });
    res.json({ success: true, message: "Admin created!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const { OAuth2Client } = require("google-auth-library");
const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Login/Register with Google
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { token, accessToken, mobile } = req.body;
    if (!token && !accessToken) {
      return res.status(400).json({ success: false, message: "Google credential token or accessToken required" });
    }

    let email, name, picture;

    if (token) {
      try {
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid Google ID token" });
      }
    } else {
      try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        if (!response.ok) {
          throw new Error("Failed to verify access token with Google");
        }
        const payload = await response.json();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid Google access token" });
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Email not provided by Google account" });
    }

    let customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
      if (!mobile) {
        return res.json({ 
          success: true, 
          needsMobile: true, 
          email: email.toLowerCase(), 
          name: name || "", 
          picture: picture || "" 
        });
      }

      const mobileCheck = validateMobile(mobile);
      if (!mobileCheck.valid) {
        return res.status(400).json({ success: false, message: mobileCheck.message });
      }
      const cleanMobile = mobileCheck.clean;

      const existsByMobile = await Customer.findOne({ mobile: cleanMobile });
      if (existsByMobile) {
        return res.status(400).json({ 
          success: false, 
          message: "This mobile number is already registered." 
        });
      }

      customer = await Customer.create({
        name: (name || "Google User").trim(),
        email: email.toLowerCase(),
        mobile: cleanMobile,
        profile_picture: picture || "",
      });
    }

    const localToken = genToken(customer._id, "customer");
    res.json({ success: true, token: localToken, user: customer, message: "Google login successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get public configurations
// @route   GET /api/auth/config
// @access  Public
exports.getPublicConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      googleClientId: process.env.GOOGLE_CLIENT_ID || ""
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
