const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

attendanceSchema.index({ organizationId: 1, classId: 1, date: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
