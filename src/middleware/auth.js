// ===== src/middleware/auth.js =====
import { verifyToken } from '../utils/jwt.js';
import { ApiResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(ApiResponse.unauthorized('Token de acceso requerido'));
    }

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'access') {
      return res.status(401).json(ApiResponse.unauthorized('Tipo de token inválido'));
    }

    const user = await User.findById(decoded.userId)
      .populate('globalRole')
      .select('-refreshToken');

    if (!user || !user.isActive) {
      return res.status(401).json(ApiResponse.unauthorized('Usuario no válido'));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(ApiResponse.unauthorized('Token inválido'));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).populate('globalRole');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

