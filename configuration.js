const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_manager",
  jwtSecret:
    process.env.JWT_SECRET ||
    "529b779d61cd7eea1890eafa21a38abe33279023ea2edeb2e3c14ab6920b43eb",
};
