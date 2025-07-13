import dotenv from "dotenv";
dotenv.config();

const API_KEYS = {
  [process.env.ADMIN_KEY]: "admin",
  [process.env.READER_KEY]: "read",
};

const validateApiKey = (req, res, next) => {
  const apiKey = req.header("X-API-Key");
  console.log("Received API key:", apiKey);
  console.log("Expected keys:", Object.keys(API_KEYS));
  if (!apiKey) {
    return res.status(401).json({ message: "API key is required" });
  }

  const role = API_KEYS[apiKey];
  console.log(role);

  if (!role) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  req.userRole = role;
  next();
};

export default validateApiKey;
