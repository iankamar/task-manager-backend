const { ERROR_MESSAGES } = require("../config/constants");
const logger = require("../config/logger");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require("./error");

module.exports = function errorHandler(err, req, res, next) {
  logger.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof InternalServerError
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res
      .status(BadRequestError.statusCode)
      .json({ message: err.message });
  }

  if (err.name === "MongoError") {
    return res
      .status(InternalServerError.statusCode)
      .json({ message: ERROR_MESSAGES.DATABASE_ERROR });
  }

  return res
    .status(InternalServerError.statusCode)
    .json({ message: ERROR_MESSAGES.SERVER_ERROR });
};
