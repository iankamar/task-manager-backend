const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleWare = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleWare, taskController.getAllTasks);
router.post("/", authMiddleWare, taskController.createTask);
router.get("/:taskId", authMiddleWare, taskController.getTaskById);
router.put("/:taskId", authMiddleWare, taskController.updateTask);
router.delete("/:taskId", authMiddleWare, taskController.deleteTask);

module.exports = router;
