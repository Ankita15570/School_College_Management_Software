const mongoose = require("mongoose");
const { logger } = require("../../config/logger");

const helpCenterSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issue: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["Technical", "Account", "General", "Other"],
    required: true,
    default: "General",
  },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


helpCenterSchema.pre("save", function (next) {
  logger.info(`Saving help request for user: ${this.userId}`);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("HelpCenter", helpCenterSchema);