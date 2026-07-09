const express = require("express");
const router = express.Router();
const salonController = require("../controllers/salonController");

router.post("/register", salonController.registerSalon);
router.get("/nearby", salonController.getNearbySalons);
router.get("/", salonController.getApprovedSalons);
router.get("/:id", salonController.getSalonById);

module.exports = router;
