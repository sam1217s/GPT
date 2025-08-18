// ===== src/routes/categories.js =====
import express from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/permissions.js';
import { USER_ROLES } from '../config/constants.js';
import { body, param, query } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get categories (all authenticated users)
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
    query('search').optional().trim().isLength({ min: 2 }).withMessage('Búsqueda mínimo 2 caracteres')
  ],
  handleValidationErrors,
  categoryController.getCategories
);

// Create category (Admin and Project Manager)
router.post('/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.PROJECT_MANAGER]),
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
  ],
  handleValidationErrors,
  categoryController.createCategory
);

// Update category (Admin and Project Manager)
router.put('/:id',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.PROJECT_MANAGER]),
  [
    param('id').isMongoId().withMessage('ID de categoría inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
  ],
  handleValidationErrors,
  categoryController.updateCategory
);

// Delete category (Admin only)
router.delete('/:id',
  requireRole([USER_ROLES.ADMIN]),
  [param('id').isMongoId().withMessage('ID de categoría inválido')],
  handleValidationErrors,
  categoryController.deleteCategory
);

export default router;

