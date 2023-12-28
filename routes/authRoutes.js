const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;

/*
const express = require("express");
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/signup", registerValidation, authController.signup);
router.post("/signin", loginValidation, authController.signin);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  authController.forgotPassword
);

module.exports = router;
*/
