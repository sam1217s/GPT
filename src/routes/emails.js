// ===== src/routes/emails.js =====
import express from 'express';
import { emailController } from '../controllers/emailController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/permissions.js';
import { USER_ROLES } from '../config/constants.js';
import { body } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Send project update email
router.post('/project-update',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.PROJECT_MANAGER]),
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('projectName').trim().isLength({ min: 3 }).withMessage('Nombre de proyecto requerido'),
    body('updateMessage').trim().isLength({ min: 10 }).withMessage('Mensaje de actualización requerido'),
    body('firstName').trim().isLength({ min: 2 }).withMessage('Nombre requerido')
  ],
  handleValidationErrors,
  emailController.sendProjectUpdate
);

// Send custom email (Admin only)
router.post('/custom',
  requireRole([USER_ROLES.ADMIN]),
  [
    body('to').isEmail().withMessage('Email destino inválido'),
    body('subject').trim().isLength({ min: 3 }).withMessage('Asunto requerido'),
    body('html').trim().isLength({ min: 10 }).withMessage('Contenido HTML requerido'),
    body('text').optional().trim()
  ],
  handleValidationErrors,
  emailController.sendCustomEmail
);

export default router;