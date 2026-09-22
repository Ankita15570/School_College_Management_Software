const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  rollNumber: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "UG", "PG"] 
  },
  phoneNumber: { 
    type: String, 
    trim: true, 
    match: [/^\d{10}$/, "Phone number must be 10 digits"] 
  },
  dateOfBirth: { type: Date },
  address: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure email and rollNumber are unique within an organization
studentSchema.index({ organizationId: 1, email: 1 }, { unique: true });
studentSchema.index({ organizationId: 1, rollNumber: 1 }, { unique: true });
studentSchema.index({ classId: 1, category: 1 });

studentSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  if (this.dateOfBirth && new Date(this.dateOfBirth) > new Date()) {
    return next(new Error("Date of birth cannot be in the future"));
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);