import bcrypt from 'bcryptjs';
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
    const { id } = req.user;
    const { name, email, phone, dateOfBirth, gender, specialty, availableTimes } = req.body;

    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (availableTimes && !availableTimes.every(time => timeFormatRegex.test(time))) {
      return res.status(400).json({ message: 'Available times must be in the format "HH:MM AM/PM"' });
    }

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

export const updatePassword = async (req, res) => {
  try {
    const { id, role } = req.user; // Get user ID and role from authenticated request
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    // Determine the user model based on the role
    const User = role === 'patient' ? Patient : Doctor;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
