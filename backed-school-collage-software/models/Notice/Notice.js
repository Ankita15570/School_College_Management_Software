const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  deadline: { type: String },
  targetRoles: [{ type: String, enum: ["Students", "Teacher", "Faculty", "Principal", "All"] }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  academicYear: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
