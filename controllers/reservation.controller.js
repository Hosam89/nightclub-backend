import Event from "../models/Event.model.js";
import Reservation from "../models/Reservation.model.js";
import { validationResult } from "express-validator";

export const getEventReservations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const reservations = await Reservation.find({ eventID: eventId }).select(
      "reservationCode user seats status createdAt"
    );
    if (!reservations) return [];
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get reservations" });
  }
};

// Create reservation
export const createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { eventID, fullname, email, seats, phoneNumber } = req.body;

    const event = await Event.findById(eventID);
    if (!event || !event.isActive)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    if (new Date() > event.date)
      return res
        .status(400)
        .json({ success: false, message: "Event already passed" });

    // Find already reserved seats for this event
    const reservedSeatsDocs = await Reservation.find({
      eventID,
      status: { $in: ["CONFIRMED"] },
    }).select("seats");

    const reservedSeats = reservedSeatsDocs.flatMap((r) => r.seats);

    // Check if any requested seat is already taken
    const conflict = seats.find((seat) => reservedSeats.includes(seat));
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Seat ${conflict} is already taken`,
      });
    }

    //Create reservation if seats are free
    const reservation = new Reservation({
      reservationCode: generateCode(),
      eventID,
      user: { fullname, email, phoneNumber },
      seats,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await reservation.save();

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

// Update reservation (Admin)
export const updateReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { reservationCode } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findOne({ reservationCode });
    if (!reservation)
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });

    reservation.status = status;
    await reservation.save();

    res.json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

// Check availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { eventID } = req.params;
    const event = await Event.findById(eventID);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const reservedSeats = await Reservation.getReservedSeats(eventID);
    res.json({
      success: true,
      data: {
        totalCapacity: event.capacity,
        reservedSeats,
        availableCount: event.capacity - reservedSeats.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Helper
const generateCode = () =>
  `RES-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;
