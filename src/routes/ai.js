// ===== src/routes/ai.js (ACTUALIZADO) =====
import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { strictRateLimit } from '../middleware/rateLimit.js';
import { body } from 'express-validator';

const router = express.Router();

// All AI routes require authentication and strict rate limiting
router.use(authenticateToken);
router.use(strictRateLimit);

// Test connection
router.get('/test',
  aiController.testConnection
);

// Generate tasks
router.post('/generate-tasks',
  [
    body('projectDescription')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
    body('projectName')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('El nombre debe tener entre 3 y 200 caracteres')
  ],
  handleValidationErrors,
  aiController.generateTasks
);

// Analyze project
router.post('/analyze-project',
  [
    body('projectId')
      .isMongoId()
      .withMessage('ID de proyecto inválido')
  ],
  handleValidationErrors,
  aiController.analyzeProject
);

// Estimate time
router.post('/estimate-time',
  [
    body('taskDescription')
      .trim()
      .isLength({ min: 5, max: 1000 })
      .withMessage('La descripción debe tener entre 5 y 1000 caracteres'),
    body('taskType')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El tipo debe tener entre 2 y 50 caracteres')
  ],
  handleValidationErrors,
  aiController.estimateTime
);

// Generate summary
router.post('/generate-summary',
  [
    body('projectId')
      .isMongoId()
      .withMessage('ID de proyecto inválido')
  ],
  handleValidationErrors,
  aiController.generateSummary
);

export default router;