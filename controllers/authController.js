import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { generateToken } from '../utils/tokenUtils.js';

export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;

    if (!name || !email || !password || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    const patient = new Patient({ name, email, password, phone, dateOfBirth, gender });
    await patient.save();
    const token = generateToken(patient._id, 'patient');
    res.status(201).json({ token, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      phone,
      dateOfBirth,
      gender,
      availableTimes,
      price,
      clinicAvailability,
      homeVisitAvailability
    } = req.body;

    if (!name || !email || !password || !specialty || !phone || !dateOfBirth || !gender || !availableTimes || price === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validGenders = ['Male', 'Female'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      specialty,
      phone,
      dateOfBirth,
      gender,
      availableTimes,
      price,
      clinicAvailability,
      homeVisitAvailability
    });

    await doctor.save();
    const token = generateToken(doctor._id, 'doctor');
    res.status(201).json({ token, doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const User = role === 'patient' ? Patient : Doctor;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Provided password:', password);
    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role === 'doctor') {
      if (!user.licenseDocument || !user.insuranceDocument) {
        return res.status(403).json({ message: 'Please upload your license and insurance documents before logging in' });
      }
      if (!user.isDocumentsAccepted) {
        return res.status(403).json({ message: 'Your documents have not been accepted yet. Please wait for admin approval.' });
      }
    }

    const token = generateToken(user._id, role);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};