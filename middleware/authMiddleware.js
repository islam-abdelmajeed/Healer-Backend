const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const jwtConfig = require('../config/jwt');

const authMiddleware = (role) => async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;

    if (role && role !== decoded.role) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const User = decoded.role === 'patient' ? Patient : Doctor;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
