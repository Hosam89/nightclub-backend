import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import eventRoutes from "./routes/eventRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
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

// MongoDB connection
async function connect() {
  try {
    mongoose.connection.on("connected", () => console.log("✅ DB connected"));
    mongoose.connection.on("error", (err) => console.error("❌ DB Error", err));

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}
connect();

app.disable("x-powered-by");

// Routes
app.use("/api/events", eventRoutes);

// Error handling
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
