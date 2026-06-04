const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
const { protect } = require("../middleware/authMiddleware");
const { requireRoles } = require("../middleware/roleMiddleware");

// Public endpoints
router.post("/subscribe", newsletterController.subscribe);

// Protected endpoints
router.get("/subscribers", protect, requireRoles("owner", "admin"), newsletterController.getSubscribers);
router.delete("/subscriber/:id", protect, requireRoles("owner", "admin"), newsletterController.deleteSubscriber);

module.exports = router;
