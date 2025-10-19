const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reportType: {
    type: String,
    enum: ['Blood Test', 'X-Ray', 'Ultrasound', 'MRI', 'CT Scan', 'Prescription', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  aiSummary: {
    english: String,
    urdu: String,
    abnormalValues: [String],
    questionsForDoctor: [String],
    foodsToAvoid: [String],
    foodsToEat: [String],
    homeRemedies: [String],
    disclaimer: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
