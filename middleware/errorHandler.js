const { errorLogger } = require("../logs/logger");
const { ERROR_MESSAGES } = require("../constants");
const NotFoundError = require("../error");

module.exports = function errorHandler(err, req, res) {
  errorLogger.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ msg: err.message });
  }

  if (err.name === "MongoError") {
    return res.status(500).json({ msg: ERROR_MESSAGES.DATABASE_ERROR });
  }

  return res.status(500).json({ msg: ERROR_MESSAGES.SERVER_ERROR });
};
