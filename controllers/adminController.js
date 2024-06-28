import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/tokenUtils.js';

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    
    const admin = new Admin({ name, email, password});
    await admin.save();

    const token = generateToken(admin._id, 'admin');
    res.status(201).json({ token, admin, role: 'admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptDoctorDocuments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isDocumentsAccepted = true;
    await doctor.save();
    res.status(200).json({ message: 'Doctor documents accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectDoctorDocuments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isDocumentsAccepted = false;
    await doctor.save();
    res.status(200).json({ message: 'Doctor documents rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    let user;
    if (userType === 'patient') {
      user = await Patient.findById(userId);
    } else if (userType === 'doctor') {
      user = await Doctor.findById(userId);
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: `${userType} blocked successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    let user;
    if (userType === 'patient') {
      user = await Patient.findById(userId);
    } else if (userType === 'doctor') {
      user = await Doctor.findById(userId);
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: `${userType} unblocked successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingDoctorDocuments = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      licenseDocument: { $exists: true, $ne: null },
      insuranceDocument: { $exists: true, $ne: null },
      isDocumentsAccepted: false,
    });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};