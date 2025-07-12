const API_KEYS = {
  [process.env.ADMIN_KEY]: "admin",
  [process.env.READER_KEY]: "read",
};

const validateApiKey = (req, res, next) => {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return res.status(401).json({ message: "API key is required" });
  }

  const role = API_KEYS[apiKey];
  if (!role) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  req.userRole = role;
  next();
};

module.exports = validateApiKey;
