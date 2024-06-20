import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'raterModel',
    required: true,
  },
  raterModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor'],
  },
  ratee: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'rateeModel',
    required: true,
  },
  rateeModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rating', ratingSchema);
