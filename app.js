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
  origin: [
    "http://localhost:3000",
    // Uncomment the line below if deploying to Vercel
    // "https://task-manager-frontend-fawn.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS to all routes
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

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
