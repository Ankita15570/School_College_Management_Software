const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  name: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true, trim: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure class name is unique within an organization and academic year
classSchema.index({ organizationId: 1, name: 1, academicYear: 1 }, { unique: true });
classSchema.index({ teacherId: 1 });

classSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Class", classSchema);