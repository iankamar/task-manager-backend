const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { loggers } = require("winston");
const { ERROR_MESSAGES, RESPONSE_MESSAGES } = require("../config/constants");
const envConfig = require("../config/envConfig");
const logger = require("../config/logger");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const InternalServerError = require("../errors/InternalServerError");
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("../middleware/validationMiddleware");

const saltLength = 10;

exports.signup = async (req, res) => {
  // validate request
  const { error } = registerValidation(req.body);
  if (error) {
    return res
      .status(BadRequestError.statusCode)
      .send({ message: error.details[0].message });
  }

  const { email, password, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(ConflictError.statusCode)
        .json({ message: ERROR_MESSAGES.USER_EXISTS });
    }
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword,
      name,
    });

    const savedUser = await newUser.save();

    // remove password
    const userObject = savedUser.toObject();
    delete userObject.password;

    return res.send({
      user: savedUser,
      message: "User successfully registered",
    });
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    logger.error("Registration error:", err.message);
    return res
      .status(InternalServerError.statusCode)
      .send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.signin = async (req, res) => {
  // validate request
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(BadRequestError.statusCode)
      .send({ message: error.details[0].message });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { lastLogin: new Date() }
    ).select("-__v");

    if (!user) {
      return res
        .status(BadRequestError.statusCode)
        .send({ message: ERROR_MESSAGES.INVALID_EMAIL });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(BadRequestError.statusCode)
        .send({ message: ERROR_MESSAGES.INVALID_PASSWORD });
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    const accessToken = jwt.sign(payload, envConfig.jwtSecret, {
      expiresIn: 360000,
    });

    // remove password
    const userObject = user.toObject();
    delete userObject.password;

    const response = {
      // user,
      token: accessToken,
    };

    return res.send(response);
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    loggers.error("Login error:", err);
    return res
      .status(InternalServerError.statusCode)
      .send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.forgotPassword = async (req, res) => {
  // validate request
  const { error } = forgotPasswordValidation(req.body);
  if (error) {
    return res
      .status(BadRequestError.statusCode)
      .send({ message: error.details[0].message });
  }
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ email });

    if (!user) {
      return res
        .status(NotFoundError.statusCode)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    logger.info(message);

    return res
      .status(200)
      .json({ success: true, data: RESPONSE_MESSAGES.EMAIL_SENT });
  } catch (err) {
    logger.error(err.message, {
      router: req.originalUrl,
      method: req.method,
      requestedTime: new Date().toLocaleString(),
    });
    logger.error(`Forgot password error: ${err}`);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res
      .status(InternalServerError.statusCode)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
