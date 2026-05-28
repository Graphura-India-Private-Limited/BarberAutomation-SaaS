const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:salon_id", serviceController.getSalonServices);
router.post("/", protect, serviceController.createService);
router.delete("/:id", protect, serviceController.deleteService);

module.exports = router;
