const mongoose = require("mongoose");
const { logger } = require("../../config/logger");

const periodSchema = new mongoose.Schema({
  time: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  periods: [periodSchema],
});

const timeTableSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Made required
  class: { type: String, required: true },
  academicYear: { type: String, required: true, trim: true },
  schedule: [daySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for performance
timeTableSchema.index({
  organizationId: 1,
  userId: 1,
  class: 1,
  academicYear: 1,
}); // Updated index

timeTableSchema.pre("save", function (next) {
  logger.info(
    `Saving timetable for user: ${this.userId}, class: ${this.class}`
  );
  this.updatedAt = Date.now();
  next();
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = { TimeTable };
