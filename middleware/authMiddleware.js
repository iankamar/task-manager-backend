const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ERROR_MESSAGES } = require("../constants");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: ERROR_MESSAGES.AUTH_NO_TOKEN });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.user.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ msg: ERROR_MESSAGES.AUTH_INVALID_TOKEN });
  }

  return undefined;
};
