const express = require("express");
const paymentController = require("../controllers/paymentController");
const revenueController = require("../controllers/revenueController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");
const { verifyPaymentSignature } = require("../middleware/paymentVerificationMiddleware");
const { verifyRazorpayWebhook } = require("../middleware/razorpayWebhookMiddleware");

const router = express.Router();

router.post("/webhook", verifyRazorpayWebhook, paymentController.handleWebhook);

router.use(protect);

router.post("/create-order", paymentController.createRazorpayOrder);
router.post("/verify", verifyPaymentSignature, paymentController.verifyPayment);
router.post("/refund", requireRoles("owner", "admin"), paymentController.refundPayment);
router.post("/:id/retry", paymentController.retryFailedPayment);
router.patch("/:id/failed", paymentController.markFailedPayment);

router.get("/history", requireRoles("owner", "admin"), paymentController.listPayments);
router.get("/", requireRoles("owner", "admin"), paymentController.listPayments);
router.get("/token", requireRoles("owner", "admin"), paymentController.getTokenPayments);
router.get("/full", requireRoles("owner", "admin"), paymentController.getFullPayments);
router.get("/pending", requireRoles("owner", "admin"), paymentController.getPendingPayments);
router.get("/salon/:salonId", requireRoles("owner", "admin"), paymentController.getPaymentsBySalon);
router.get("/barber/:barberId", requireRoles("owner", "admin"), paymentController.getPaymentsByBarber);
router.get("/date-range", requireRoles("owner", "admin"), paymentController.getPaymentsByDateRange);

router.get("/revenue/dashboard", requireRoles("owner", "admin"), revenueController.getRevenueDashboard);
router.get("/revenue/daily", requireRoles("owner", "admin"), revenueController.getDailyRevenue);
router.get("/revenue/total", requireRoles("owner", "admin"), revenueController.getTotalRevenue);
router.get("/revenue/services", requireRoles("owner", "admin"), revenueController.getServiceWiseRevenue);
router.get("/revenue/barbers", requireRoles("owner", "admin"), revenueController.getBarberWiseRevenue);
router.get("/revenue/monthly", requireRoles("owner", "admin"), revenueController.getMonthlyRevenue);
router.get("/revenue/trends", requireRoles("owner", "admin"), revenueController.getRevenueTrends);
router.get("/revenue/salon-breakdown", requireRoles("owner", "admin"), revenueController.getSalonBreakdown);
router.get("/:id", requireRoles("owner", "admin"), paymentController.getPaymentById);

module.exports = router;
