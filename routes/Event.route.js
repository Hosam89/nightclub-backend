import express from "express";
import multer from "multer";
import requireAuth from "../middleware/requireAuth.js";
import checkRole from "../middleware/checkRole.js";
import * as eventController from "../controllers/event.controller.js";

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: "uploads/events",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// Middleware to skip JSON parsing for multipart requests
const skipJsonForMultipart = (req, res, next) => {
  const contentType = req.get("Content-Type") || "";

  if (contentType.startsWith("multipart/form-data")) {
    // Skip the body parsing that was already done by express.json()
    // Multer will handle parsing the multipart data
    return next();
  }
  next();
};

// Protect everything with login
router.use(requireAuth);

// Regular routes (use default JSON parsing)
router.get("/", checkRole(["read", "admin"]), eventController.getEvents);
router.get("/:id", checkRole(["read", "admin"]), eventController.getEventById);
router.delete("/:id", checkRole(["admin"]), eventController.deleteEvent);

// Multer routes (bypass JSON parsing)
router.post(
  "/",
  checkRole(["admin"]),
  skipJsonForMultipart,
  upload.single("file"),
  eventController.createEvent
);

router.put(
  "/:id",
  checkRole(["admin"]),
  skipJsonForMultipart,
  upload.single("file"),
  eventController.updateEvent
);

export default router;
