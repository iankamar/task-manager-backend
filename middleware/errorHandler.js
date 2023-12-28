const { ERROR_MESSAGES } = require("../config/constants");
const logger = require("../config/logger");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const InternalServerError = require("../errors/InternalServerError");

module.exports = function errorHandler(err, req) {
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
    throw err;
  }

  if (err.name === "ValidationError") {
    throw new BadRequestError(err.message);
  }

  if (err.name === "MongoError") {
    throw new InternalServerError(ERROR_MESSAGES.DATABASE_ERROR);
  }

  throw new InternalServerError(ERROR_MESSAGES.SERVER_ERROR);
};
