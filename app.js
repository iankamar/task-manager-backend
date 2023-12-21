const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { requestLogger } = require("./logs/logger");
const errorHandler = require("./middleware/errorHandler");
const limiter = require("./rateLimiter");

const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".envdevelopment";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://www.iankamar-taskmanager.cbu.net"],
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

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

const { PORT = 3001 } = process.env;

// Security headers
app.use(helmet());

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

app.use((req, res, next) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
