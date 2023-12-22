const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ERROR_MESSAGES, RESPONSE_MESSAGES } = require("../constants");
const validationMiddleware = require("../middleware/validationMiddleware");

exports.register = async (req, res) => {
  const errors = validationMiddleware(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ msg: ERROR_MESSAGES.USER_EXISTS });
    }

    const newUser = new User({
      email,
      password,
      name,
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
  return null;
};

exports.login = async (req, res, next) => {
  validationMiddleware(req, res, next);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ msg: ERROR_MESSAGES.INVALID_EMAIL });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: ERROR_MESSAGES.INVALID_PASSWORD });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
  return null;
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: ERROR_MESSAGES.USER_NOT_FOUND });
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

    console.log(message);

    return res
      .status(200)
      .json({ success: true, data: RESPONSE_MESSAGES.EMAIL_SENT });
  } catch (err) {
    console.error("Forgot password error:", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};
