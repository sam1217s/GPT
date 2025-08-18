// ===== src/routes/states.js =====
import express from 'express';
import { stateController } from '../controllers/stateController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/permissions.js';
import { body, param } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get states
router.get('/projects', stateController.getProjectStates);
router.get('/tasks', stateController.getTaskStates);

// Admin only routes
router.post('/',
  requireAdmin,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nombre inválido'),
    body('type').isIn(['Project', 'Task']).withMessage('Tipo inválido'),
    body('order').optional().isInt({ min: 1 }).withMessage('Orden inválido')
  ],
  handleValidationErrors,
  stateController.createState
);

router.put('/:id',
  requireAdmin,
  [
    param('id').isMongoId().withMessage('ID de estado inválido'),
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nombre inválido'),
    body('order').optional().isInt({ min: 1 }).withMessage('Orden inválido')
  ],
  handleValidationErrors,
  stateController.updateState
);

export default router;

