// ===== src/validators/uploadValidators.js =====
import { param } from 'express-validator';

export const uploadAvatarValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido')
];

export const uploadProjectFileValidator = [
  param('projectId')
    .isMongoId()
    .withMessage('ID de proyecto inválido')
];