const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["School", "College", "University", "Other"] },
  address: { type: String },
  website: { type: String },
  accreditationBody: { type: String },
  naacGrade: { type: String },
  contactPerson: {
    fullName: { type: String },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  
}, { timestamps: true });

module.exports = mongoose.model("Organization", organizationSchema);