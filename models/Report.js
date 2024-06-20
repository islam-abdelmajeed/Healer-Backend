import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'reporterModel',
    required: true,
  },
  reporterModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor'],
  },
  reported: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'reportedModel',
    required: true,
  },
  reportedModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor'],
  },
  reason: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Report', reportSchema);
