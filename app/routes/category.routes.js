const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/", categoryController.addCategory);
router.get("/", categoryController.listCategories);
router.put("/:id", categoryController.editCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
