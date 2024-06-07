const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwtConfig = require('../config/jwt');

const generateToken = require('../utils/generateToken');

exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const patient = new Patient({ name, email, password, phone });
    await patient.save();
    const token = generateToken(patient._id, 'patient');
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, phone, availableTimes } = req.body;
    const doctor = new Doctor({ name, email, password, specialty, phone, availableTimes });
    await doctor.save();
    const token = generateToken(doctor._id, 'doctor');
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const User = role === 'patient' ? Patient : Doctor;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id, role);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
