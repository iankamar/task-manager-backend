const express = require("express");
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    check("username").isLength({ min: 1 }).withMessage("Username is required"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res);
    return null;
  }
);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/users/me", authMiddleware, authController.getMe);

module.exports = router;
