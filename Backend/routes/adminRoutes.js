const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

/* ── STATS ── */
router.get("/global-metrics", protect, requireRoles("admin"), adminController.getGlobalMetrics);
router.get("/users-overview", protect, requireRoles("admin"), adminController.getUsersOverview);
router.put("/salon-limit/:id", protect, requireRoles("admin"), adminController.updateSalonLimit);
router.get("/stats", protect, requireRoles("admin"), adminController.getAdminStats);

/* ── SALONS ── */
router.get("/salons", protect, requireRoles("admin"), adminController.getAllSalons);
router.put("/salon/:id/status", protect, requireRoles("admin"), adminController.updateSalonStatus);

/* ── CUSTOMERS ── */
router.get("/customers", protect, requireRoles("admin"), adminController.getAllCustomers);
router.put("/customer/:id/block", protect, requireRoles("admin"), adminController.blockCustomer);
router.delete("/customer/:id", protect, requireRoles("admin"), adminController.deleteCustomer);

/* ── BARBERS ── */
router.get("/barbers", protect, requireRoles("admin"), adminController.getAllBarbers);
router.post("/barber", protect, requireRoles("admin"), adminController.addBarber);
router.put("/barber/:id/status", protect, requireRoles("admin"), adminController.updateBarberStatus);
router.delete("/barber/:id", protect, requireRoles("admin"), adminController.deleteBarber);

/* ── BOOKINGS ── */
router.get("/bookings", protect, requireRoles("admin"), adminController.getAllBookings);
router.put("/booking/:id/status", protect, requireRoles("admin"), adminController.updateBookingStatus);

/* ── SERVICES ── */
router.get("/services", protect, requireRoles("admin"), adminController.getAllServices);
router.post("/service", protect, requireRoles("admin"), adminController.addService);
router.put("/service/:id", protect, requireRoles("admin"), adminController.updateService);
router.delete("/service/:id", protect, requireRoles("admin"), adminController.deleteService);

/* ── PAYMENTS ── */
router.get("/payments", protect, requireRoles("admin"), adminController.getAllPayments);

/* ── REVIEWS ── */
router.get("/reviews", protect, requireRoles("admin"), adminController.getAllReviews);
router.delete("/review/:id", protect, requireRoles("admin"), adminController.deleteReview);

/* ── CREATE ADMIN ── */
router.post("/create", adminController.createAdmin);

module.exports = router;
