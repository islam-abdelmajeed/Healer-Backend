import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Regular expression to validate time format "HH:MM AM/PM"
const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true }, 
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  availableTimes: {
    type: [String],
    default: [],
    validate: {
      validator: function(times) {
        return times.every(time => timeFormatRegex.test(time));
      },
      message: props => `${props.value} is not a valid time format. Use "HH:MM AM/PM"`
    }
  },
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
