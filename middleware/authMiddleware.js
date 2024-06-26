import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Admin from '../models/Admin.js'; // Import the Admin model
import jwtConfig from '../config/jwt.js';

const authMiddleware = (role) => async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = { id: decoded.id, role: decoded.role }; // Set user ID and role from token

    if (role && role !== decoded.role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let User;
    if (decoded.role === 'patient') {
      User = Patient;
    } else if (decoded.role === 'doctor') {
      User = Doctor;
    } else if (decoded.role === 'admin') {
      User = Admin;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if ((decoded.role === 'patient' || decoded.role === 'doctor') && user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
    }

    req.user = { id: user._id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
