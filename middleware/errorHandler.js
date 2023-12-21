const { errorLogger } = require("../logs/logger");

module.exports = function errorHandler(err, req, res, next) {
  errorLogger.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  if (err.name === "ValidationError") {
    return res.status(400).json({ msg: err.message });
  }

  if (err.name === "MongoError") {
    return res.status(500).json({ msg: "Database error" });
  }

  return res.status(500).json({ msg: "Server error" });
};
