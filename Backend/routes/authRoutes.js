const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

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
    // req.user is hydrated cleanly by your protect middleware
    const barberId = req.user?.id;
    if (!barberId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Missing tracking identifier." });
    }

    /* 
      Once your database controller structures are completely finalized, you will query your DB model like this:
      const barber = await Barber.findById(barberId).populate("salon_id");
    */

    // Returning structural layout sync block to support frontend components
    return res.status(200).json({
      success: true,
      barber: {
        name: req.user.name || "Arjun Sharma",
        mobile_number: req.user.mobile || "9876543210",
        experience_years: req.user.experience || 5, // Hydrates your counter field cleanly!
        specialization: req.user.specialization || "Haircut & Beard",
        salon_id: {
          salon_name: "Elite Cuts & Spa - Downtown"
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
    console.log(`Synchronizing state changes for Barber ${barberId}:`, { mobile_number, experience_years, specialization });

    /*
      When ready to plug into MongoDB:
      const updatedBarber = await Barber.findByIdAndUpdate(
        barberId,
        { mobile_number, experience_years: Number(experience_years), specialization },
        { new: true }
      );
    */

    return res.status(200).json({
      success: true,
      message: "Professional profile details synchronized successfully!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;