import express from "express";
import {
  createReservation,
  updateReservation,
  checkAvailability,
  getEventReservations,
} from "../controllers/reservation.controller.js";
import {
  CreateReservationDto,
  UpdateReservationDto,
  CheckAvailabilityDto,
} from "../dto/reservation.dto.js";

import validateApiKey from "../middleware/apiKeyMiddleware.js";
import checkRole from "../middleware/checkRole.js";
const router = express.Router();
router.use(validateApiKey);
// Public
router.post("/", CreateReservationDto, createReservation);
router.get(
  "/event/:eventID/availability",
  CheckAvailabilityDto,
  checkAvailability
);

// Admin
router.get("/event/:eventId", checkRole(["admin"]), getEventReservations);

router.patch(
  "/:reservationCode",
  checkRole(["admin"]),
  UpdateReservationDto,
  updateReservation
);

export default router;
