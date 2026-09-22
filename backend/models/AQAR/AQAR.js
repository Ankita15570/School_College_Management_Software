const mongoose = require('mongoose');
const { logger } = require('../../config/logger');

const aqarSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  academicYear: { type: String, required: true, trim: true },
  part: { type: String, enum: ['A', 'B'], required: true },
  criterion: {
    type: String,
    enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', null],
    required: function () {
      return this.part === 'B';
    },
  },
  keyIndicator: { // New field for Key Indicator
    type: String,
    required: function () {
      return this.part === 'B';
    },
  },
  title: { type: String, required: true, trim: true },
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }, // Reference to Media for uploaded documents
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending', // Default status is Pending
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('AQAR', aqarSchema);