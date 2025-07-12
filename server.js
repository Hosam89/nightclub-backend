const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const eventRoutes = require("./routes/eventRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.postman.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.disable("x-powered-by");
app.use("/api/events", eventRoutes);
app.use(errorHandler);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
