const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const taskRoutes = require("./task.routes");
const categoryRoutes = require("./category.routes");
const labelRoutes = require("./label.routes");
const reminderRoutes = require("./reminder.routes");
const reportRoutes = require("./report.routes");

router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/categories", categoryRoutes);
router.use("/labels", labelRoutes);
router.use("/reminders", reminderRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
