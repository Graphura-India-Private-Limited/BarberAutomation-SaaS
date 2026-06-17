const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");
const Notification = require("../models/Notification");
const Barber = require("../models/Barber");


/* ══════════════════════════════════════
    CUSTOMER AUTH — OTP Based
   ══════════════════════════════════════ */

/* ── Send OTP — only for REGISTERED users ── */
router.post("/send-otp", authController.sendOtp);

/* ── Verify OTP ── */
router.post("/verify-otp", authController.verifyOtp);

/* ── Signup — creates new account ── */
router.post("/signup", authController.signup);

router.get("/profile", protect, requireRoles("customer"), authController.getProfile);
router.put("/profile", protect, requireRoles("customer"), authController.updateProfile);
router.post("/family-member", protect, requireRoles("customer"), authController.addFamilyMember);
router.delete("/family-member/:id", protect, requireRoles("customer"), authController.deleteFamilyMember);

/* ── Customer Notifications ── */
router.get("/notifications", protect, requireRoles("customer"), async (req, res) => {
  try {
    const notifications = await Notification.find({ customer_id: req.user._id }).sort({ created_at: -1 }).limit(30);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/notifications/mark-read", protect, requireRoles("customer"), async (req, res) => {
  try {
    await Notification.updateMany({ customer_id: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: "Notifications marked as read." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/notifications", protect, requireRoles("customer"), async (req, res) => {
  try {
    await Notification.deleteMany({ customer_id: req.user._id });
    res.json({ success: true, message: "Notifications cleared." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ══════════════════════════════════════
    OWNER AUTH
   ══════════════════════════════════════ */

router.post("/owner/send-otp", authController.sendOwnerOtp);
router.post("/owner/register", authController.registerOwner);
router.post("/owner/login", authController.loginOwner);

router.get("/owner/profile", protect, requireRoles("owner"), authController.getOwnerProfile);
router.put("/owner/profile", protect, requireRoles("owner"), authController.updateOwnerProfile);
router.put("/owner/resubmit", protect, requireRoles("owner"), authController.resubmitOwnerProfile);

/* ══════════════════════════════════════
    BARBER AUTH
   ══════════════════════════════════════ */

router.post("/barber/register", protect, requireRoles("owner", "admin"), authController.registerBarber);
router.post("/barber/login", authController.loginBarber);
router.put("/barber/change-password", protect, requireRoles("barber"), authController.changeBarberPassword);

/* ══════════════════════════════════════
    ADMIN AUTH
   ══════════════════════════════════════ */

router.post("/admin/login", authController.loginAdmin);
router.post("/admin/login/mobile", authController.loginAdminMobile);
router.post("/admin/verify-mpin", protect, requireRoles("admin"), authController.verifyMpin);
router.post("/admin/create", authController.createAdmin);
/* ── ✅ GET: Fetch current profile values on page refresh ── */
router.get("/barber/profile", protect, requireRoles("barber", "owner", "admin"), async (req, res) => {
  try {
    const barberId = req.user?.id;
    if (!barberId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing tracking identifier." });
    }

    const barber = await Barber.findById(barberId).populate("salon_id");
    if (!barber) {
      return res.status(404).json({ success: false, barber: { name: req.user.name, mobile_number: req.user.mobile, experience_years: req.user.experience || 5, specialization: req.user.specialization || "Haircut & Beard", salon_id: { salon_name: "Elite Cuts & Spa - Downtown" } } });
    }

    return res.status(200).json({
      success: true,
      barber: {
        name: barber.name,
        mobile_number: barber.mobile,
        experience_years: barber.experience,
        specialization: barber.specialization,
        salon_id: {
          salon_name: barber.salon_id?.salon_name || "Elite Cuts & Spa - Downtown"
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ── ✅ PUT: Commit changed data values securely back to database ── */
router.put("/barber/update-profile", protect, requireRoles("barber", "owner", "admin"), async (req, res) => {
  try {
    const barberId = req.user?.id;
    if (!barberId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing tracking identifier." });
    }

    const { mobile_number, experience_years, specialization } = req.body;

    const updateData = {};
    if (req.user.role === "barber") {
      updateData.mobile = mobile_number;
    } else {
      updateData.mobile = mobile_number;
      if (experience_years !== undefined) updateData.experience = Number(experience_years);
      if (specialization !== undefined) updateData.specialization = specialization;
    }

    const updatedBarber = await Barber.findByIdAndUpdate(
      barberId,
      updateData,
      { new: true }
    );

    if (!updatedBarber) {
      return res.status(404).json({ success: false, message: "Barber not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Professional profile details synchronized successfully!",
      barber: updatedBarber
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;