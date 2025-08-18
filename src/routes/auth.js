

// ===== src/routes/auth.js =====
import express from 'express';
import { authController } from '../controllers/authController.js';
import { 
  registerValidator, 
  loginValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator 
} from '../validators/authValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', 
  authRateLimit,
  registerValidator,
  handleValidationErrors,
  authController.register
);

router.post('/login',
  authRateLimit,
  loginValidator,
  handleValidationErrors,
  authController.login
);

router.post('/refresh',
  authRateLimit,
  authController.refreshToken
);

router.post('/forgot-password',
  authRateLimit,
  forgotPasswordValidator,
  handleValidationErrors,
  authController.forgotPassword
);

router.post('/reset-password',
  authRateLimit,
  resetPasswordValidator,
  handleValidationErrors,
  authController.resetPassword
);

// Protected routes
router.post('/logout',
  authenticateToken,
  authController.logout
);

export default router;

