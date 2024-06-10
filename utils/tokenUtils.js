import crypto from 'crypto';

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, hashedToken };
};

import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};
