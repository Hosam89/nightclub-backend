const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.route("/").get(getEvents).post(createEvent);

router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

module.exports = router;
