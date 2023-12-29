const express = require("express");

const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const NotFoundError = require("../errors/NotFoundError");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

router.use((req, res, next) => {
  next(new NotFoundError("Not found route"));
});

module.exports = router;
