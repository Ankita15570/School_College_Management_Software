const mongoose = require("mongoose");
const { logger } = require("../../config/logger");

const feedbackSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
  academicYear: { type: String, required: true, trim: true },
  feedbackType: {
    type: String,
    enum: ["General Feedback", "Bug Report", "Feature Request"],
    default: "General Feedback",
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  message: { type: String, required: true, trim: true },
  followUp: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for performance
feedbackSchema.index({ organizationId: 1, userId: 1 });
feedbackSchema.index({ createdAt: 1 });

feedbackSchema.pre("save", function (next) {
  logger.info(`Saving feedback for user: ${this.userId}`);
  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);