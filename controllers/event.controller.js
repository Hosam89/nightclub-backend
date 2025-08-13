import Event from "../models/Event.js";
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
} from "../dto/event.dto.js";

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Create
export async function createEvent(req, res, next) {
  try {
    const eventDto = new CreateEventDto(req.body);
    eventDto.slug = eventDto.slug || generateSlug(eventDto.title);
    const event = new Event(eventDto.toModel());
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

    const event = await Event.findByIdAndUpdate(req.params.id, updateDto, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });
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
    res.status(200).json(new EventResponseDto(event));
  } catch (err) {
    next(err);
  }
}
