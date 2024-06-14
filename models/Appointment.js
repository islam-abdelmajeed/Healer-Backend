import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store time as a string (e.g., "09:00 AM")
  appointmentType: { 
    type: String, 
    enum: ['Home', 'Clinic'],
    default: 'Home'
  }, // Specify Home or Clinic visit
  status: { 
    type: String, 
    enum: ['Pending', 'Done', 'Cancelled'], 
    default: 'Pending' 
  } // Appointment status with default 'Pending'
});

export default mongoose.model('Appointment', appointmentSchema);
