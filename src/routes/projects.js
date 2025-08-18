// ===== src/routes/projects.js =====
import express from 'express';
import { projectController } from '../controllers/projectController.js';
import { 
  createProjectValidator, 
  updateProjectValidator, 
  addMemberValidator,
  projectIdValidator 
} from '../validators/projectValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireProjectAccess, requireProjectOwner } from '../middleware/permissions.js';
import { query, param } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get projects
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
    query('category').optional().isMongoId().withMessage('ID de categoría inválido'),
    query('status').optional().isMongoId().withMessage('ID de estado inválido'),
    query('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Prioridad inválida'),
    query('search').optional().trim().isLength({ min: 2 }).withMessage('Búsqueda mínimo 2 caracteres')
  ],
  handleValidationErrors,
  projectController.getProjects
);

// Create project
router.post('/',
  createProjectValidator,
  handleValidationErrors,
  projectController.createProject
);

// Get specific project
router.get('/:id',
  projectIdValidator,
  handleValidationErrors,
  requireProjectAccess,
  projectController.getProjectById
);

// Update project (owner or admin)
router.put('/:id',
  updateProjectValidator,
  handleValidationErrors,
  requireProjectOwner,
  projectController.updateProject
);

// Add member to project (owner or admin)
router.post('/:id/members',
  addMemberValidator,
  handleValidationErrors,
  requireProjectOwner,
  projectController.addMember
);

// Remove member from project (owner or admin)
router.delete('/:id/members/:userId',
  [
    param('id').isMongoId().withMessage('ID de proyecto inválido'),
    param('userId').isMongoId().withMessage('ID de usuario inválido')
  ],
  handleValidationErrors,
  requireProjectOwner,
  projectController.removeMember
);

// Delete project (owner or admin)
router.delete('/:id',
  projectIdValidator,
  handleValidationErrors,
  requireProjectOwner,
  projectController.deleteProject
);

export default router;

