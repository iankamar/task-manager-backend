const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const InternalServerError = require("../errors/InternalServerError");
const logger = require("../config/logger"); // add this line
const { ERROR_MESSAGES } = require("../config/constants"); // add this line

module.exports = function errorHandler(err, req, res) {
  let error = err;

  logger.error({
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    ip: req.ip,
  });

  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError ||
    error instanceof InternalServerError
  ) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error.name === "ValidationError") {
    error = new BadRequestError(error.message);
  } else if (error.name === "MongoError") {
    error = new InternalServerError(ERROR_MESSAGES.DATABASE_ERROR);
  } else if (!(error instanceof InternalServerError)) {
    error = new InternalServerError(ERROR_MESSAGES.SERVER_ERROR);
  }

  return res.status(error.statusCode || 500).json({ message: error.message });
};
