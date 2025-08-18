// ===== src/routes/users.js =====
import express from 'express';
import { userController } from '../controllers/userController.js';
import { 
  updateProfileValidator, 
  updateUserRoleValidator, 
  userIdValidator,
  usersQueryValidator 
} from '../validators/userValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole, requireAdmin } from '../middleware/permissions.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', userController.getProfile);

router.put('/profile',
  updateProfileValidator,
  handleValidationErrors,
  userController.updateProfile
);

// Admin only routes
router.get('/',
  requireAdmin,
  usersQueryValidator,
  handleValidationErrors,
  userController.getAllUsers
);

router.put('/:id/role',
  requireAdmin,
  updateUserRoleValidator,
  handleValidationErrors,
  userController.updateUserRole
);

router.delete('/:id',
  requireAdmin,
  userIdValidator,
  handleValidationErrors,
  userController.deleteUser
);

export default router;

