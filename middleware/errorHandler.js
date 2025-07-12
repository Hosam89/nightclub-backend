// filepath: e:\code\nightclub-backend\middleware\errorHandler.js
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  // Log error details
  logger.error({
    message: err.message,
    method: req.method,
    url: req.url,
    stack: err.stack,
  });

  // Always hide stack trace unless explicitly requested
  const response = {
    message: err.message || "Internal Server Error",
  };

  // Optionally show stack trace if a query param is present (for debugging)
  if (req.query.debug === "true") {
    response.stack = err.stack;
  }

  // Example: handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json(response);
};
