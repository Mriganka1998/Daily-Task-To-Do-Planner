const express = require("express");
const router = express.Router();
const labelController = require("../controllers/label.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/", labelController.addLabel);
router.get("/", labelController.listLabels);

module.exports = router;
