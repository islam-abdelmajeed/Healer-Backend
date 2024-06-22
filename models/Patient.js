import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true }, 
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  rate: { type: Number, default: 5 },
  idNumber: { type: String },
  photos: { type: [String] },
  isBlocked: { type: Boolean, default: false }
});

patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('Patient', patientSchema);
