const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleWare = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", authMiddleWare, taskController.getAllTasks);
router.post(
  "/",
  authMiddleWare,
  validationMiddleware.taskValidation,
  taskController.createTask
);
router.get("/:taskId", authMiddleWare, taskController.getTaskById);
router.put(
  "/:taskId",
  authMiddleWare,
  validationMiddleware.taskValidation,
  taskController.updateTask
);
router.delete("/:taskId", authMiddleWare, taskController.deleteTask);

module.exports = router;
