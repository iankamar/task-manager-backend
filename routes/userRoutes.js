const express = require("express");
const userController = require("../controllers/userController");
const authMiddleWare = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleWare, userController.getMe);

module.exports = router;
