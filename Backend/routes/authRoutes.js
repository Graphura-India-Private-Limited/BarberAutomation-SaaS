const express  = require("express");
const router   = express.Router();
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Barber   = require("../models/Barber");
const Admin    = require("../models/Admin");
const Salon    = require("../models/Salon");
const OtpStore = require("../models/OtpStore");
const { protect } = require("../middleware/authMiddleware");

const genToken = (id, role = "customer") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ══════════════════════════════════════
   CUSTOMER AUTH — OTP Based
══════════════════════════════════════ */

router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.length !== 10)
      return res.status(400).json({ success:false, message:"Enter valid 10-digit mobile" });
    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await OtpStore.deleteMany({ mobile });
    await OtpStore.create({ mobile, otp, expires_at:expires });
    console.log(`\n🔐 OTP for ${mobile}: ${otp}\n`);
    res.json({ success:true, message:`OTP sent to ${mobile}`, otp });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp)
      return res.status(400).json({ success:false, message:"Mobile and OTP required" });
    const record = await OtpStore.findOne({ mobile, otp });
    if (!record)
      return res.status(400).json({ success:false, message:"Invalid OTP. Please try again." });
    if (new Date() > record.expires_at) {
      await OtpStore.deleteMany({ mobile });
      return res.status(400).json({ success:false, message:"OTP expired. Request a new one." });
    }
    await OtpStore.deleteMany({ mobile });
    let customer = await Customer.findOne({ mobile });
    const isNew  = !customer;
    if (!customer) customer = await Customer.create({ mobile });
    const token = genToken(customer._id, "customer");
    res.json({ success:true, token, isNew, user:customer });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { mobile, name, email } = req.body;
    let customer = await Customer.findOne({ mobile });
    if (customer) {
      customer.name  = name  || customer.name;
      customer.email = email || customer.email;
      await customer.save();
    } else {
      customer = await Customer.create({ mobile, name, email });
    }
    const token = genToken(customer._id, "customer");
    res.json({ success:true, token, user:customer });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ success:false, message:"Not found" });
    res.json({ success:true, user:customer });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const customer = await Customer.findByIdAndUpdate(req.user.id, { name, email }, { new:true });
    res.json({ success:true, user:customer });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/family-member", protect, async (req, res) => {
  try {
    const { name, relation, age } = req.body;
    const customer = await Customer.findById(req.user.id);
    customer.family_members.push({ name, relation, age });
    await customer.save();
    const member = customer.family_members[customer.family_members.length - 1];
    res.json({ success:true, member });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.delete("/family-member/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    customer.family_members = customer.family_members.filter(
      m => m._id.toString() !== req.params.id
    );
    await customer.save();
    res.json({ success:true, message:"Removed" });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ══════════════════════════════════════
   OWNER AUTH — Mobile + Password
══════════════════════════════════════ */

router.post("/owner/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.length !== 10)
      return res.status(400).json({ success:false, message:"Enter valid 10-digit mobile" });
    const otp     = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await OtpStore.deleteMany({ mobile });
    await OtpStore.create({ mobile, otp, expires_at:expires });
    console.log(`\n🏪 Owner OTP for ${mobile}: ${otp}\n`);
    res.json({ success:true, message:`OTP sent to ${mobile}`, otp });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/owner/register", async (req, res) => {
  try {
    const { mobile, otp, owner_name, salon_name, email, address, password } = req.body;
    const record = await OtpStore.findOne({ mobile, otp });
    if (!record)
      return res.status(400).json({ success:false, message:"Invalid OTP" });
    if (new Date() > record.expires_at) {
      await OtpStore.deleteMany({ mobile });
      return res.status(400).json({ success:false, message:"OTP expired" });
    }
    await OtpStore.deleteMany({ mobile });
    const exists = await Salon.findOne({ mobile });
    if (exists)
      return res.status(400).json({ success:false, message:"Salon already registered with this mobile" });
    const password_hash = await bcrypt.hash(password, 10);
    const salon = await Salon.create({
      owner_name, salon_name, mobile,
      email:    email   || "",
      address:  address || "",
      password_hash,
      status: "pending"
    });
    const token = genToken(salon._id, "owner");
    res.status(201).json({ success:true, token, salon, message:"Salon registered! Awaiting admin approval." });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/owner/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password)
      return res.status(400).json({ success:false, message:"Mobile and password required" });
    const salon = await Salon.findOne({ mobile });
    if (!salon)
      return res.status(400).json({ success:false, message:"Salon not found. Please register first." });
    if (!salon.password_hash)
      return res.status(400).json({ success:false, message:"No password set. Contact admin." });
    const ok = await bcrypt.compare(password, salon.password_hash);
    if (!ok)
      return res.status(400).json({ success:false, message:"Wrong password" });
    if (salon.status === "rejected")
      return res.status(400).json({ success:false, message:`Registration rejected: ${salon.rejection_reason}` });
    const token = genToken(salon._id, "owner");
    res.json({ success:true, token, salon, status:salon.status });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.get("/owner/profile", protect, async (req, res) => {
  try {
    const salon = await Salon.findById(req.user.id);
    if (!salon) return res.status(404).json({ success:false, message:"Not found" });
    res.json({ success:true, salon });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ══════════════════════════════════════
   BARBER AUTH — Mobile + Password
══════════════════════════════════════ */

router.post("/barber/register", protect, async (req, res) => {
  try {
    const { salon_id, name, mobile, password, specialization, experience } = req.body;
    const exists = await Barber.findOne({ mobile });
    if (exists)
      return res.status(400).json({ success:false, message:"Barber already exists with this mobile" });
    const password_hash = await bcrypt.hash(password, 10);
    const barber = await Barber.create({
      salon_id, name, mobile, password_hash,
      specialization: specialization || "",
      experience:     experience     || 0,
    });
    res.status(201).json({ success:true, barber, message:"Barber registered!" });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.post("/barber/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password)
      return res.status(400).json({ success:false, message:"Mobile and password required" });
    const barber = await Barber.findOne({ mobile, is_active:true })
      .populate("salon_id", "salon_name address status");
    if (!barber)
      return res.status(400).json({ success:false, message:"Barber not found. Contact your salon owner." });
    const ok = await barber.matchPassword(password);
    if (!ok)
      return res.status(400).json({ success:false, message:"Wrong password" });
    const token = genToken(barber._id, "barber");
    res.json({ success:true, token, barber });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

router.put("/barber/change-password", protect, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const barber = await Barber.findById(req.user.id);
    const ok = await barber.matchPassword(old_password);
    if (!ok) return res.status(400).json({ success:false, message:"Wrong current password" });
    barber.password_hash = await bcrypt.hash(new_password, 10);
    await barber.save();
    res.json({ success:true, message:"Password changed!" });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ══════════════════════════════════════
   ADMIN AUTH — Mobile + Password + MPIN
══════════════════════════════════════ */

/* ── Admin Login by Email (old) ── */
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success:false, message:"Email and password required" });
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ success:false, message:"Admin not found" });
    const ok = await admin.matchPassword(password);
    if (!ok)
      return res.status(400).json({ success:false, message:"Wrong password" });
    const token = genToken(admin._id, "admin");
    res.json({ success:true, token, requireMpin:true });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ── Admin Login by Mobile (new) ── */
router.post("/admin/login/mobile", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password)
      return res.status(400).json({ success:false, message:"Mobile and password required" });
    const admin = await Admin.findOne({ mobile });
    if (!admin)
      return res.status(400).json({ success:false, message:"Admin not found with this mobile" });
    const ok = await admin.matchPassword(password);
    if (!ok)
      return res.status(400).json({ success:false, message:"Wrong password" });
    const token = genToken(admin._id, "admin");
    res.json({ success:true, token, requireMpin:true });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ── Admin Verify MPIN ── */
router.post("/admin/verify-mpin", protect, async (req, res) => {
  try {
    const { mpin } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ success:false, message:"Admin not found" });
    const ok = await admin.matchMpin(mpin);
    if (!ok) return res.status(400).json({ success:false, message:"Wrong MPIN" });
    res.json({ success:true, message:"MPIN verified" });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

/* ── Create Admin ── */
router.post("/admin/create", async (req, res) => {
  try {
    const { email, password, mpin, mobile } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ success:false, message:"Admin already exists" });
    const password_hash = await bcrypt.hash(password, 10);
    const mpin_hash     = await bcrypt.hash(mpin, 10);
    await Admin.create({ email, mobile: mobile||"", password_hash, mpin_hash });
    res.json({ success:true, message:"Admin created!" });
  } catch (err) {
    res.status(500).json({ success:false, message:err.message });
  }
});

module.exports = router;