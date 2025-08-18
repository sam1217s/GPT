// ===== src/routes/roles.js =====
import express from 'express';
import { roleController } from '../controllers/roleController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/permissions.js';
import { body, param } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public role routes (for dropdowns, etc.)
router.get('/', roleController.getRoles);

// Admin only routes
router.post('/',
  requireAdmin,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('description')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('La descripción debe tener entre 5 y 200 caracteres')
  ],
  handleValidationErrors,
  roleController.createRole
);

router.put('/:id',
  requireAdmin,
  [
    param('id').isMongoId().withMessage('ID de rol inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('La descripción debe tener entre 5 y 200 caracteres')
  ],
  handleValidationErrors,
  roleController.updateRole
);

router.delete('/:id',
  requireAdmin,
  [param('id').isMongoId().withMessage('ID de rol inválido')],
  handleValidationErrors,
  roleController.deleteRole
);

export default router;

