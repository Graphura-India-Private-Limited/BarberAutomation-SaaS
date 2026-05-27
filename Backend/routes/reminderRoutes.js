const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, reminderController.getMyReminders);
router.post("/", protect, reminderController.createReminder);
router.put("/:id", protect, reminderController.updateReminder);
router.delete("/:id", protect, reminderController.deleteReminder);

module.exports = router;
