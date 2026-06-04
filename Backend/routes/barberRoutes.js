const express = require("express");
const router = express.Router();
const barberController = require("../controllers/barberController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

router.get("/salon/:salon_id", barberController.getBarbersBySalon);
router.post("/", protect, requireRoles("owner", "admin"), barberController.createBarber);
router.put("/:id/status", protect, requireRoles("owner", "admin", "barber"), barberController.updateBarberStatus);
router.get("/:id/dashboard", protect, requireRoles("barber", "owner", "admin"), barberController.getBarberDashboard);

router.put("/:barber_id/queue/:queue_id/start", protect, requireRoles("barber", "owner", "admin"), barberController.startService);
router.put("/:barber_id/queue/:queue_id/complete", protect, requireRoles("barber", "owner", "admin"), barberController.completeService);
router.put("/:barber_id/queue/:queue_id/noshow", protect, requireRoles("barber", "owner", "admin"), barberController.markNoShow);

router.post("/:id/break-request", protect, requireRoles("barber"), barberController.submitBreakRequest);
router.put("/:id/break-end", protect, requireRoles("barber"), barberController.endBreak);

router.put("/:id", protect, requireRoles("barber", "owner", "admin"), barberController.updateBarberProfile);
router.delete("/:id", protect, requireRoles("owner", "admin"), barberController.deactivateBarber);

module.exports = router;
