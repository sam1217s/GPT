// ===== src/middleware/errorHandler.js =====
import winston from 'winston';
import { ApiResponse } from '../utils/apiResponse.js';

// Configurar Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'project-management-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE) || 5242880,
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE) || 5242880,
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  // Log del error
  logger.error({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id
  });

  // Errores de Mongoose
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación';
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(statusCode).json(ApiResponse.validationError(errors, message));
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Recurso duplicado';
    const field = Object.keys(error.keyValue)[0];
    message = `${field} ya existe`;
  }

  // Errores de JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Error personalizado con statusCode
  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};

export { logger };
export default errorHandler;

