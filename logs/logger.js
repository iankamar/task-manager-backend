const winston = require("winston");
require("winston-daily-rotate-file");

const requestLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({ filename: "logs/request.log" }),
  ],
});

const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({ filename: "logs/error.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  requestLogger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
  errorLogger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

module.exports = {
  requestLogger,
  errorLogger,
};
