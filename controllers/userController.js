import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { generateResetToken, generateToken } from '../utils/tokenUtils.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

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
    const { id, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const User = role === 'patient' ? Patient : Doctor;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await Patient.findOne({ email }) || await Doctor.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { resetToken, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await Patient.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } }) ||
                 await Doctor.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

