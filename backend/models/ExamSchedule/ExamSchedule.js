const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subject: { type: String, required: true, trim: true },
  examType: { type: String, enum: ["Unit Test", "Mid Term", "Final", "Practical", "Oral", "Other"], required: true },
  examDate: { type: String, required: true },
  startTime: { type: String },
  endTime: { type: String },
  totalMarks: { type: Number },
  academicYear: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("ExamSchedule", examScheduleSchema);
