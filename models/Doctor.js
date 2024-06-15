import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: {type: String,  enum:["Male", "Female"], required: true },
  address: { type: String, required: true },
  availableTimes: { type: [String], default: []},
  licenseDocument: String,
  insuranceDocument: String,
  isDocumentsAccepted: { type: Boolean, default: false },
  resetPasswordCode: String,
  resetPasswordExpires: Date,
  price: { type: Number, required: true },
  clinicAvailability: { type: Boolean, default: true },
  homeVisitAvailability: { type: Boolean, default: true } 
});

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('Doctor', doctorSchema);
