import Event from "../models/Event.model.js";
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
} from "../dto/event.dto.js";
import fs from "fs";
import path from "path";

// Paths
const imagesDir = path.resolve("public/eventsImages");

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Utility: generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Utility: remove an image safely
function removeImage(imagePath) {
  if (!imagePath) return;
  const fullPath = path.resolve("public", imagePath.replace(/^\//, ""));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

// Create
export async function createEvent(req, res, next) {
  try {
    const eventDto = new CreateEventDto(req.body);
    eventDto.slug = eventDto.slug || generateSlug(eventDto.title);

    const event = new Event(eventDto.toModel());

    if (req.file) {
      const ext = path.extname(req.file.originalname) || ".jpg";
      const destPath = path.join(imagesDir, `${event._id}${ext}`);
      fs.renameSync(req.file.path, destPath);

      event.image = `/eventsImages/${event._id}${ext}`;
    }

    await event.save();

    res.status(201).json(new EventResponseDto(event));
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({ message: "Slug must be unique" });
    }
    next(err);
  }
}

// Read All
export async function getEvents(req, res, next) {
  try {
    const events = await Event.find();
    const eventDtos = events.map((event) => new EventResponseDto(event));
    res.status(200).json(eventDtos);
  } catch (err) {
    next(err);
  }
}

// Read One by ID
export async function getEventById(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(new EventResponseDto(event));
  } catch (err) {
    next(err);
  }
}

// Update
export async function updateEvent(req, res, next) {
  try {
    const updateDto = new UpdateEventDto(req.body);
    if (updateDto.title && !updateDto.slug) {
      updateDto.slug = generateSlug(updateDto.title);
    }

    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // If new image uploaded, remove old and save new
    if (req.file) {
      removeImage(event.imagePath);

      const ext = path.extname(req.file.originalname) || ".jpg";
      const destPath = path.join(imagesDir, `${event._id}${ext}`);
      fs.renameSync(req.file.path, destPath);

      updateDto.image = `/eventsImages/${event._id}${ext}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateDto, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(new EventResponseDto(event));
  } catch (err) {
    next(err);
  }
}

// Delete
export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    removeImage(event.imagePath);

    res.status(200).json(new EventResponseDto(event));
  } catch (err) {
    next(err);
  }
}
