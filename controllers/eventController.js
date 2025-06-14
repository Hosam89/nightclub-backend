const { readEvents, writeEvents } = require("../utils/fileDB");
const { v4: uuidv4 } = require("uuid");

// Create
exports.createEvent = (req, res, next) => {
  try {
    const events = readEvents();
    const newEvent = { id: uuidv4(), ...req.body };
    events.push(newEvent);
    writeEvents(events);
    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
};

// Read All
exports.getEvents = (req, res, next) => {
  try {
    const events = readEvents();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// Read One
exports.getEventById = (req, res, next) => {
  try {
    const events = readEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateEvent = (req, res, next) => {
  try {
    const events = readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ message: "Event not found" });
    events[index] = { ...events[index], ...req.body };
    writeEvents(events);
    res.status(200).json(events[index]);
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteEvent = (req, res, next) => {
  try {
    let events = readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ message: "Event not found" });
    const deleted = events.splice(index, 1);
    writeEvents(events);
    res.status(200).json(deleted[0]);
  } catch (err) {
    next(err);
  }
};
