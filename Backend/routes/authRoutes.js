const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

/* ══════════════════════════════════════
    CUSTOMER AUTH — OTP Based
   ══════════════════════════════════════ */

/* ── Send OTP — only for REGISTERED users ── */
router.post("/send-otp", authController.sendOtp);

/* ── Verify OTP ── */
router.post("/verify-otp", authController.verifyOtp);

/* ── Signup — creates new account ── */
router.post("/signup", authController.signup);

router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.post("/family-member", protect, authController.addFamilyMember);
router.delete("/family-member/:id", protect, authController.deleteFamilyMember);

/* ══════════════════════════════════════
    OWNER AUTH
   ══════════════════════════════════════ */

router.post("/owner/send-otp", authController.sendOwnerOtp);
router.post("/owner/register", authController.registerOwner);
router.post("/owner/login", authController.loginOwner);

router.get("/owner/profile", protect, authController.getOwnerProfile);
router.put("/owner/profile", protect, authController.updateOwnerProfile);
router.put("/owner/resubmit", protect, authController.resubmitOwnerProfile);

/* ══════════════════════════════════════
    BARBER AUTH
   ══════════════════════════════════════ */

router.post("/barber/register", protect, authController.registerBarber);
router.post("/barber/login", authController.loginBarber);
router.put("/barber/change-password", protect, authController.changeBarberPassword);

/* ══════════════════════════════════════
    ADMIN AUTH
   ══════════════════════════════════════ */

router.post("/admin/login", authController.loginAdmin);
router.post("/admin/login/mobile", authController.loginAdminMobile);
router.post("/admin/verify-mpin", protect, authController.verifyMpin);
router.post("/admin/create", authController.createAdmin);

/* ── Newsletter Subscribe ── */
router.post("/subscribe", authController.subscribeNewsletter);

module.exports = router;