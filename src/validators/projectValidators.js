// ===== src/validators/projectValidators.js =====
import { body, param, query } from 'express-validator';
import Category from '../models/Category.js';
import State from '../models/State.js';

export const createProjectValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El nombre debe tener entre 3 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('categoryId')
    .isMongoId()
    .withMessage('ID de categoría inválido')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category || !category.isActive) {
        throw new Error('Categoría no encontrada o inactiva');
      }
    }),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Prioridad inválida'),

  body('startDate')
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),

  body('endDate')
    .isISO8601()
    .withMessage('Fecha de fin inválida')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),

  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas estimadas deben ser un número positivo'),

  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número positivo'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags debe ser un array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada tag debe tener entre 1 y 50 caracteres')
];

export const updateProjectValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de proyecto inválido'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El nombre debe tener entre 3 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Prioridad inválida'),

  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida'),

  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas estimadas deben ser un número positivo'),

  body('actualHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas actuales deben ser un número positivo'),

  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número positivo')
];

export const addMemberValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de proyecto inválido'),

  body('userId')
    .isMongoId()
    .withMessage('ID de usuario inválido')
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        throw new Error('Usuario no encontrado o inactivo');
      }
    }),

  body('roleId')
    .isMongoId()
    .withMessage('ID de rol inválido')
    .custom(async (roleId) => {
      const role = await Role.findById(roleId);
      if (!role || !role.isActive) {
        throw new Error('Rol no encontrado o inactivo');
      }
    })
];

export const projectIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de proyecto inválido')
];

