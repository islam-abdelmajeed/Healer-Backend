import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
  availableTimes: { type: [String], required: true },
  licenseDocument: { type: String, default: null }, 
  insuranceDocument: { type: String, default: null }, 
});

DoctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
