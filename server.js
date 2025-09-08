import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import eventRoutes from "./routes/Event.route.js";
import reservationRoutes from "./routes/Reservation.route.js";
import authRoutes from "./routes/auth.routes.js";
import session from "express-session";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// ----- Middleware ----- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Helmet security
// Disable Cross-Origin-Resource-Policy globally to allow images from other origins
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Rate limiter
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);

// ----- API CORS ----- //
app.use(
  "/api",
  cors({
    origin: ["http://localhost:5173", "https://www.postman.com"],
    credentials: true,
  })
);

// ----- Public folder ----- //
app.use(express.static("public"));

// ----- Static images folder ----- //

app.use(
  "/eventsImages",
  cors({ origin: "*" }),
  express.static(path.join(__dirname, "eventsImages"))
);

app.use("/eventsImages", (req, res, next) => {
  res.removeHeader("Cross-Origin-Resource-Policy");
  next();
});

// ----- MongoDB connection ----- //
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

// ----- Disable x-powered-by header ----- //
app.disable("x-powered-by");

// ----- Routes ----- //
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reservations", reservationRoutes);

// Error handling
app.use(errorHandler);

// ----- Start Server ----- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
