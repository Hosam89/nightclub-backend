import { body, param, query } from "express-validator";

// 1. Create Reservation (public)
export const CreateReservationDto = [
  body("eventID").isMongoId().withMessage("Valid event ID is required"),

  body("fullname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("seats")
    .isArray({ min: 1 })
    .withMessage("At least one seat is required"),

  body("seats.*")
    .isInt({ min: 1 })
    .withMessage("Each seat must be a positive number"),
];

// 2. Update Reservation Status (admin)
export const UpdateReservationDto = [
  param("reservationCode")
    .notEmpty()
    .withMessage("Reservation code is required"),
  body("status")
    .isIn(["PENDING", "CONFIRMED", "CANCELLED"])
    .withMessage("Invalid status"),
];

// 3. Check Availability
export const CheckAvailabilityDto = [
  param("eventID").isMongoId().withMessage("Valid event ID is required"),
  query("seats")
    .optional()
    .isArray()
    .withMessage("Seats must be an array if provided"),
];
