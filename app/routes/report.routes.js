const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/summary", reportController.getSummary);
router.get("/statistics", reportController.getStatistics);
router.post("/send-summary-email", reportController.sendSummaryEmail);

module.exports = router;
