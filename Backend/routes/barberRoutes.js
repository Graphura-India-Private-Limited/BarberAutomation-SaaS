const express = require("express");
const router = express.Router();
const barberController = require("../controllers/barberController");
const { protect } = require("../middleware/authMiddleware");

router.get("/salon/:salon_id", barberController.getBarbersBySalon);
router.post("/", protect, barberController.createBarber);
router.put("/:id/status", protect, barberController.updateBarberStatus);
router.get("/:id/dashboard", protect, barberController.getBarberDashboard);

router.put("/:barber_id/queue/:queue_id/start", protect, barberController.startService);
router.put("/:barber_id/queue/:queue_id/complete", protect, barberController.completeService);
router.put("/:barber_id/queue/:queue_id/noshow", protect, barberController.markNoShow);

router.post("/:id/break-request", protect, barberController.submitBreakRequest);
router.put("/:id/break-end", protect, barberController.endBreak);

router.put("/:id", protect, barberController.updateBarberProfile);
router.delete("/:id", protect, barberController.deactivateBarber);

module.exports = router;
