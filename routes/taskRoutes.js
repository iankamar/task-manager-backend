const express = require("express");
const { check, validationResult } = require("express-validator");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    taskController.createTask(req, res);
    return null;
  }
);

router.get("/:taskId", taskController.getTaskById);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
