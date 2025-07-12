// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const validateApiKey = require("../middleware/apiKeyMiddleware");
const checkRole = require("../middleware/checkRole");
const eventController = require("../controllers/eventController");

// All routes require API key
router.use(validateApiKey);

// Public routes (requires read key)
router.get("/", checkRole(["read", "admin"]), eventController.getEvents);
router.get("/:id", checkRole(["read", "admin"]), eventController.getEventById);

// Staff and admin only routes
router.post("/", checkRole(["admin"]), eventController.createEvent);

// Admin only routes
router.put("/:id", checkRole(["admin"]), eventController.updateEvent);
router.delete("/:id", checkRole(["admin"]), eventController.deleteEvent);

module.exports = router;
