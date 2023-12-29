module.exports = {
  RESPONSE_MESSAGES: {
    SERVER_STARTED: "Server is running on port",
    MONGO_CONNECTED: "Connected to MongoDB",
    TASK_REMOVED: "Task removed",
    EMAIL_SENT: "Email sent",
  },
  ERROR_MESSAGES: {
    ROUTE_NOT_FOUND: "Route not found",
    DATABASE_ERROR: "Database error",
    SERVER_ERROR: "Server error",
    AUTH_INVALID_TOKEN: "Invalid or expired auth token",
    AUTH_NOTFOUND_TOKEN: "Malformed or unauthenticated auth token",
    TASK_NOT_FOUND: "Task not found",
    NOT_AUTHORIZED: "Not authorized",
    USER_EXISTS: "Email already exists",
    INVALID_EMAIL: "Email provided is not a registered email",
    INVALID_PASSWORD: "Password Invalid",
    AUTH_NO_TOKEN: "Access denied. Please check your API token",
    USER_NOT_FOUND: "User not found",
  },
};
