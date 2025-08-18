// ===== src/controllers/authController.js =====
import { authService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(result, 'Usuario registrado exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json(ApiResponse.success(result, 'Inicio de sesión exitoso'));
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized(error.message)
      );
    }
  },

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.headers['x-refresh-token'];
      
      if (!refreshToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          ApiResponse.unauthorized('Refresh token requerido')
        );
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.json(ApiResponse.success(result, 'Token renovado exitosamente'));
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(
        ApiResponse.unauthorized(error.message)
      );
    }
  },

  async logout(req, res, next) {
    try {
      await authService.logout(req.user._id);
      
      res.json(ApiResponse.success(null, 'Sesión cerrada exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      
      res.json(ApiResponse.success(result, 'Email de recuperación enviado'));
    } catch (error) {
      res.status(HTTP_STATUS.NOT_FOUND).json(
        ApiResponse.notFound(error.message)
      );
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      
      res.json(ApiResponse.success(result, 'Contraseña actualizada exitosamente'));
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.error(error.message, HTTP_STATUS.BAD_REQUEST)
      );
    }
  }
};






