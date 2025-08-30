import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import checkRole from "../middleware/checkRole.js";
import * as eventController from "../controllers/event.controller.js";

const router = express.Router();

// Protect everything with login
router.use(requireAuth);

// Public routes (requires at least "read" role)
router.get("/", checkRole(["read", "admin"]), eventController.getEvents);
router.get("/:id", checkRole(["read", "admin"]), eventController.getEventById);

// Admin routes
router.post("/", checkRole(["admin"]), eventController.createEvent);
router.put("/:id", checkRole(["admin"]), eventController.updateEvent);
router.delete("/:id", checkRole(["admin"]), eventController.deleteEvent);

export default router;
