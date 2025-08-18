// ===== src/middleware/validation.js =====
import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(422).json(ApiResponse.validationError(formattedErrors));
  }
  
  next();
};

