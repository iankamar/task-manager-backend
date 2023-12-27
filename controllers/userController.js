const { ERROR_MESSAGES } = require("../config/constants");
const User = require("../models/User");
const logger = require("../config/logger");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    return res.send(user);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send(ERROR_MESSAGES.SERVER_ERROR);
  }
};