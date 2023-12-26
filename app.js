const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { RESPONSE_MESSAGES, ERROR_MESSAGES } = require("./config/constants");

dotenv.config();
const envConfig = require("./config/envConfig");

const app = express();

// Import Routes
const routes = require("./routes");
const logger = require("./config/logger");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");
const errorHandler = require("./middleware/errorHandler");

const corsOptions = {
  origin: ["http://localhost:3000", "https://iankamar-taskmanager.netlify.app"],
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
  .then(() => console.log(RESPONSE_MESSAGES.MONGO_CONNECTED))
  .catch(() => console.error(ERROR_MESSAGES.DATABASE_ERROR));

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

app.use((req, res, next) => {
  logger.error(ERROR_MESSAGES.ROUTE_NOT_FOUND, {
    router: req.originalUrl,
    method: req.method,
    requestedTime: new Date().toLocaleString(),
  });
  res.status(404).json({ message: ERROR_MESSAGES.ROUTE_NOT_FOUND });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
