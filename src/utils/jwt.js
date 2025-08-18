import jwt from 'jsonwebtoken';
import { JWT_TYPES } from '../config/constants.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, type: JWT_TYPES.ACCESS },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, type: JWT_TYPES.REFRESH },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

export const generateResetToken = (payload) => {
  return jwt.sign(
    { ...payload, type: JWT_TYPES.RESET_PASSWORD },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const generateEmailVerificationToken = (payload) => {
  return jwt.sign(
    { ...payload, type: JWT_TYPES.EMAIL_VERIFICATION },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};


