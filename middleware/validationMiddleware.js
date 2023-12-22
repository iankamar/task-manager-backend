const { validationResult } = require("express-validator");
const NotFoundError = require("../error");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new NotFoundError("ValidationError", errors.array(), 400));
  } else {
    next();
  }
};

module.exports = validationMiddleware;
