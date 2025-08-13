import express from "express";
import validateApiKey from "../middleware/apiKeyMiddleware.js";
import checkRole from "../middleware/checkRole.js";
import * as eventController from "../controllers/event.controller.js";
const router = express.Router();

router.use(validateApiKey);

// Public routes
router.get("/", checkRole(["read", "admin"]), eventController.getEvents);
router.get("/:id", checkRole(["read", "admin"]), eventController.getEventById);

// Admin routes
router.post("/", checkRole(["admin"]), eventController.createEvent);
router.put("/:id", checkRole(["admin"]), eventController.updateEvent);
router.delete("/:id", checkRole(["admin"]), eventController.deleteEvent);

export default router;
