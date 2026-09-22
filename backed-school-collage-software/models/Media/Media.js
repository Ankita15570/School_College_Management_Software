const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feature: { type: String, required: true, trim: true }, // e.g., aqar
  filename: { type: String, required: true },
  s3Key: { type: String, required: true }, // S3 object key
  url: { type: String, required: true },   // Public S3 URL
  fileType: { type: String },             // e.g., application/pdf
  academicYear: { type: String, required: true, trim: true },
  uploadedAt: { type: Date, default: Date.now },
  timestamp: { type: String, default: () => new Date().toISOString() }, // ISO string for precision
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'feature', sparse: true }, // Reference to AQAR, etc.
}, { timestamps: true });

mediaSchema.index({ userId: 1, feature: 1, uploadedAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);