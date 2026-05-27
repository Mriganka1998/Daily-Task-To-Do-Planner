const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.use(authenticate);

router.post("/", taskController.addTask);
router.get("/", taskController.listTasks);
router.put("/reorder", taskController.reorderTasks);

router.put("/:id", taskController.editTask);
router.delete("/:id", taskController.deleteTask);
router.put("/:id/complete", taskController.markCompleted);

module.exports = router;
