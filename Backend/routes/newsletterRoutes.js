const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");

// Public endpoints
router.post("/subscribe", newsletterController.subscribe);
router.get("/subscribers", newsletterController.getSubscribers);
router.delete("/subscriber/:id", newsletterController.deleteSubscriber);

module.exports = router;
