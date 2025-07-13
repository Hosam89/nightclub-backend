import logger from "../utils/logger.js";

export default (err, req, res, next) => {
  logger.error({
    message: err.message,
    method: req.method,
    url: req.url,
    stack: err.stack,
  });

  const response = {
    message: err.message || "Internal Server Error",
  };

  if (req.query.debug === "true") {
    response.stack = err.stack;
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json(response);
};
