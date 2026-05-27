const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminder.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/", reminderController.setReminder);
router.put("/:id", reminderController.editReminder);
router.delete("/:id", reminderController.deleteReminder);

module.exports = router;
