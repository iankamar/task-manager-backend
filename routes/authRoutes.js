const express = require("express");
const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  validationMiddleware.registerValidation,
  authController.register
);
router.post(
  "/login",
  validationMiddleware.loginValidation,
  authController.login
);
router.post(
  "/forgot-password",
  validationMiddleware.forgotPasswordValidation,
  authController.forgotPassword
);

module.exports = router;
