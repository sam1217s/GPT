// ===== src/middleware/rateLimit.js =====
import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse.js';

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: ApiResponse.error(message, 429),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json(ApiResponse.error(message, 429));
    }
  });
};

export const generalRateLimit = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000,  // Máximo de 10,000 solicitudes
  'Demasiadas solicitudes, intenta nuevamente más tarde'
);

export const authRateLimit = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS) || 5,
  'Demasiados intentos de autenticación, intenta nuevamente más tarde'
);

export const strictRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  10,
  'Límite estricto excedido, intenta nuevamente más tarde'
);

export default generalRateLimit;

