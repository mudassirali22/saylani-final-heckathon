
const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  bloodSugar: {
    type: Number
  },
  weight: {
    type: Number
  },
  temperature: {
    type: Number
  },
  heartRate: {
    type: Number
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vital', vitalSchema);