// ===== src/validators/commentValidators.js =====
import { body, param } from 'express-validator';

export const createCommentValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de proyecto inválido'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('El comentario debe tener entre 1 y 1000 caracteres')
];

export const updateCommentValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de comentario inválido'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('El comentario debe tener entre 1 y 1000 caracteres')
];

export const commentIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de comentario inválido')
];

