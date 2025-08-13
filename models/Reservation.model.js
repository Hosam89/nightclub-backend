import mongoose from "mongoose";

const { Schema } = mongoose;

const reservationSchema = new Schema({
  reservationCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  user: {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
  },

  eventID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  seats: [{ type: Number, required: true }],

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },
});

// Auto-update `updatedAt`
reservationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Generate a reservation code
reservationSchema.methods.generateReservationCode = function () {
  const prefix = "RES";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Static method to get reserved seats for an event
reservationSchema.statics.getReservedSeats = async function (eventId) {
  const reservations = await this.find({
    eventID: eventId,
    status: { $in: ["PENDING", "CONFIRMED"] },
  }).select("seats");

  // Flatten all seat arrays into a single array
  return reservations.flatMap((res) => res.seats);
};

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
