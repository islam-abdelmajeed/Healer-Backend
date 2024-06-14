import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
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

    const User = decoded.role === 'patient' ? Patient : Doctor;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: user._id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
