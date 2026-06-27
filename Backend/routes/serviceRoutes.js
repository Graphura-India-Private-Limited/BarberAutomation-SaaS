const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

router.get("/:salon_id", serviceController.getSalonServices);
router.post("/", protect, requireRoles("owner", "admin"), serviceController.createService);
router.delete("/:id", protect, requireRoles("owner", "admin"), serviceController.deleteService);
router.put("/:id", protect, requireRoles("owner", "admin", "barber"), serviceController.updateService);

module.exports = router;
