const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ── STATS ── */
router.get("/global-metrics", adminController.getGlobalMetrics);
router.get("/users-overview", adminController.getUsersOverview);
router.put("/salon-limit/:id", adminController.updateSalonLimit);
router.get("/stats", protect, adminOnly, adminController.getAdminStats);

/* ── SALONS ── */
router.get("/salons", protect, adminOnly, adminController.getAllSalons);
router.put("/salon/:id/status", protect, adminOnly, adminController.updateSalonStatus);

/* ── CUSTOMERS ── */
router.get("/customers", protect, adminOnly, adminController.getAllCustomers);
router.put("/customer/:id/block", protect, adminOnly, adminController.blockCustomer);
router.delete("/customer/:id", protect, adminOnly, adminController.deleteCustomer);

/* ── BARBERS ── */
router.get("/barbers", protect, adminOnly, adminController.getAllBarbers);
router.post("/barber", protect, adminOnly, adminController.addBarber);
router.put("/barber/:id/status", protect, adminOnly, adminController.updateBarberStatus);
router.delete("/barber/:id", protect, adminOnly, adminController.deleteBarber);

/* ── BOOKINGS ── */
router.get("/bookings", protect, adminOnly, adminController.getAllBookings);
router.put("/booking/:id/status", protect, adminOnly, adminController.updateBookingStatus);

/* ── SERVICES ── */
router.get("/services", protect, adminOnly, adminController.getAllServices);
router.post("/service", protect, adminOnly, adminController.addService);
router.put("/service/:id", protect, adminOnly, adminController.updateService);
router.delete("/service/:id", protect, adminOnly, adminController.deleteService);

/* ── PAYMENTS ── */
router.get("/payments", protect, adminOnly, adminController.getAllPayments);

/* ── REVIEWS ── */
router.get("/reviews", protect, adminOnly, adminController.getAllReviews);
router.delete("/review/:id", protect, adminOnly, adminController.deleteReview);

/* ── NEWSLETTER SUBSCRIBERS ── */
router.get("/newsletter-subscribers", protect, adminController.getNewsletterSubscribers);
router.delete("/newsletter-subscribers/:id", protect, adminController.deleteNewsletterSubscriber);

/* ── CREATE ADMIN ── */
router.post("/create", adminController.createAdmin);

module.exports = router;
