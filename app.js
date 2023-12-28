const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const NotFoundError = require("./errors/NotFoundError");
const { RESPONSE_MESSAGES, ERROR_MESSAGES } = require("./config/constants");
const InternalServerError = require("./errors/InternalServerError");

dotenv.config();
const envConfig = require("./config/envConfig");

const app = express();

// Import Routes
const routes = require("./routes");
const logger = require("./config/logger");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");
const errorHandler = require("./middleware/errorHandler");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://iankamar-taskmanager.azurewebsites.net",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to DB
mongoose
  .connect(envConfig.mongoURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => logger.info(RESPONSE_MESSAGES.MONGO_CONNECTED))
  .catch((error) =>
    logger.error(`${ERROR_MESSAGES.DATABASE_ERROR}: ${error.message}`)
  );

const { PORT } = envConfig;

// rateLimit
app.use(rateLimitMiddleware);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Task Management API SERVER is Running!");
});

app.use("/api", routes);
/*
app.use((req, res) => {
  const error = new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND);
  errorHandler(error, req, res);
});
*/

app.use((req, res, next) => {
  logger.error(ERROR_MESSAGES.ROUTE_NOT_FOUND, {
    router: req.originalUrl,
    method: req.method,
    requestedTime: new Date().toLocaleString(),
  });
  res.status(404).json({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

app.use(errorHandler);

app.use((err, req, res) => {
  let error = err;
  if (!(error instanceof InternalServerError)) {
    error = new InternalServerError();
  }
  res.status(err.statusCode).json({ message: err.message });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
