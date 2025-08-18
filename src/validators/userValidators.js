// ===== src/validators/userValidators.js =====
import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const updateProfileValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Número de teléfono inválido')
];

export const updateUserRoleValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido'),

  body('roleId')
    .isMongoId()
    .withMessage('ID de rol inválido')
    .custom(async (roleId) => {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new Error('Rol no encontrado');
      }
    })
];

export const userIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido')
];

export const usersQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número mayor a 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe ser entre 1 y 100'),

  query('role')
    .optional()
    .isMongoId()
    .withMessage('ID de rol inválido'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Búsqueda debe tener al menos 2 caracteres')
];

