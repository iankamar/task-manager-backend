const { ERROR_MESSAGES } = require("../config/constants");
const logger = require("../config/logger");
const NotFoundError = require("./error");

module.exports = function errorHandler(err, req, res) {
  logger.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "MongoError") {
    return res.status(500).json({ message: ERROR_MESSAGES.DATABASE_ERROR });
  }

  return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
};
