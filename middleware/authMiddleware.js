const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ERROR_MESSAGES } = require("../config/constants");
const envConfig = require("../config/envConfig");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(403).send({ message: ERROR_MESSAGES.AUTH_NO_TOKEN });
    try {
      const decoded = jwt.verify(token, envConfig.jwtSecret);
      req.user = await User.findOne({ _id: decoded.user._id }).select(
        "-password"
      );
      next();
    } catch (err) {
      return res
        .status(401)
        .send({ message: ERROR_MESSAGES.AUTH_INVALID_TOKEN });
    }
  } else {
    return res
      .status(401)
      .send({ message: ERROR_MESSAGES.AUTH_NOTFOUND_TOKEN });
  }

  return Promise.resolve();
};
