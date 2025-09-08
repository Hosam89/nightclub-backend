import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  organizer: { type: String, required: true },
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "cancelled"],
    default: "scheduled",
  },
  tags: [{ type: String }],
  capacity: { type: Number, required: true },

  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
