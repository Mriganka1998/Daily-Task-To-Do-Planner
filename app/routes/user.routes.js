const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../utils/upload.util");

router.post("/signup", userController.signup);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, upload.single("profilePicture"), userController.editProfile);

module.exports = router;
