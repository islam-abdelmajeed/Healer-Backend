import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import generateToken from '../utils/generateToken.js';

export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const patient = new Patient({ name, email, password, phone });
    await patient.save();
    const token = generateToken(patient._id, 'patient');
    res.status(201).json({ token, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, phone, availableTimes } = req.body;
    const doctor = new Doctor({ name, email, password, specialty, phone, availableTimes });
    await doctor.save();
    const token = generateToken(doctor._id, 'doctor');
    res.status(201).json({ token, doctor});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const User = role === 'patient' ? Patient : Doctor;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if doctor has uploaded the necessary documents
    if (role === 'doctor' && (!user.licenseDocument || !user.insuranceDocument)) {
      return res.status(403).json({ message: 'Please upload your license and insurance documents before logging in' });
    }

    const token = generateToken(user._id, role);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
