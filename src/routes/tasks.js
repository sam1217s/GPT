// ===== src/routes/tasks.js =====
import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { 
  createTaskValidator, 
  updateTaskValidator, 
  taskIdValidator 
} from '../validators/taskValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireProjectAccess } from '../middleware/permissions.js';
import { query, param, body } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's tasks
router.get('/my-tasks',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
    query('status').optional().isMongoId().withMessage('ID de estado inválido'),
    query('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Prioridad inválida')
  ],
  handleValidationErrors,
  taskController.getUserTasks
);

// Get specific task
router.get('/:id',
  taskIdValidator,
  handleValidationErrors,
  taskController.getTaskById
);

// Update task
router.put('/:id',
  updateTaskValidator,
  handleValidationErrors,
  taskController.updateTask
);

// Assign task
router.put('/:id/assign',
  [
    param('id').isMongoId().withMessage('ID de tarea inválido'),
    body('userId').optional().isMongoId().withMessage('ID de usuario inválido')
  ],
  handleValidationErrors,
  taskController.assignTask
);

// Delete task
router.delete('/:id',
  taskIdValidator,
  handleValidationErrors,
  taskController.deleteTask
);

export default router;

