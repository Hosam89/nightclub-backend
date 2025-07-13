import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    room: { type: String, required: true },
  },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  organizer: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled"],
    default: "scheduled",
  },
  tags: [{ type: String }],
  capacity: { type: Number, required: true },
  tickets: {
    available: { type: Boolean, default: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    link: { type: String, required: true },
  },
  media: {
    banner: { type: String, required: true },
    gallery: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
