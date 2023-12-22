const express = require("express");
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const NotFoundError = require("../error");
const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", taskController.getAllTasks);
router.post(
  "/",
  [
    check("title").isLength({ min: 1 }).withMessage("Title is required"),
    check("description")
      .isLength({ min: 1 })
      .withMessage("Description is required"),
  ],
  validationMiddleware,
  taskController.createTask
);

router.get("/:taskId", async (req, res, next) => {
  const task = await taskController.getTaskById(req.params.taskId);
  if (!task) {
    next(
      new NotFoundError(
        "NotFoundError",
        `Task not found with id ${req.params.taskId}`,
        404
      )
    );
  } else {
    res.json(task);
  }
});

router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
