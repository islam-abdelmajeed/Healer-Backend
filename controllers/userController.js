import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const updatePatientInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, phone, dateOfBirth, gender } = req.body;
    
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { name, email, phone, dateOfBirth, gender },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient information updated', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctorInfo = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is set in req.user by authMiddleware
    const { name, email, phone, dateOfBirth, gender, specialty, availableTimes } = req.body;
    
    // Validate availableTimes format
    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (availableTimes && !availableTimes.every(time => timeFormatRegex.test(time))) {
      return res.status(400).json({ message: 'Available times must be in the format "HH:MM AM/PM"' });
    }

    // Find and update the doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { name, email, phone, dateOfBirth, gender, specialty, availableTimes },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor information updated', doctor: updatedDoctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
