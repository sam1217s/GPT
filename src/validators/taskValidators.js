// ===== src/validators/taskValidators.js =====
import { body, param, query } from 'express-validator';
import Project from '../models/Project.js';

export const createTaskValidator = [
  param('projectId')
    .isMongoId()
    .withMessage('ID de proyecto inválido'),

  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('ID de usuario asignado inválido')
    .custom(async (userId, { req }) => {
      if (userId) {
        const user = await User.findById(userId);
        if (!user || !user.isActive) {
          throw new Error('Usuario asignado no encontrado o inactivo');
        }
        
        // Verificar que el usuario sea miembro del proyecto
        const project = await Project.findById(req.params.projectId);
        if (project && !project.isMember(userId)) {
          throw new Error('El usuario debe ser miembro del proyecto');
        }
      }
    }),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Prioridad inválida'),

  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas estimadas deben ser un número positivo'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento inválida'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags debe ser un array')
];

export const updateTaskValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Prioridad inválida'),

  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas estimadas deben ser un número positivo'),

  body('actualHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas actuales deben ser un número positivo'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento inválida')
];

export const taskIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido')
];

