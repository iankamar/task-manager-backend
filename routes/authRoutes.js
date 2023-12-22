const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    check("username").isLength({ min: 1 }).withMessage("Username is required"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  validationMiddleware,
  authController.register
);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/users/me", authMiddleware, authController.getMe);

module.exports = router;
