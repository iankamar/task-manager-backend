const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { requestLogger, errorLogger } = require("./logs/logger");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://api.todoist.com/rest/v2",
      "https://api.todoist.com/rest/v1",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "request.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

const { PORT = 3001 } = process.env;

// Security headers
app.use(helmet());

// Rate limit to all requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use((req, res, next) => {
  requestLogger.info({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: res.statusCode,
    ip: req.ip,
  });
  next();
});

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Manager API");
});

app.use((err, req, res, next) => {
  errorLogger.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
