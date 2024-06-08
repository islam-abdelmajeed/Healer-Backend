import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

export default generateToken;
