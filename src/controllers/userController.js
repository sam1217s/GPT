// ===== src/controllers/userController.js =====
import { userService } from '../services/userService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const userController = {
  async getAllUsers(req, res, next) {
    try {
      const result = await userService.getAllUsers(req.query);
      
      res.json(ApiResponse.success(result, 'Usuarios obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user._id);
      
      res.json(ApiResponse.success(user, 'Perfil obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const result = await userService.updateProfile(req.user._id, req.body);
      
      res.json(ApiResponse.success(result, 'Perfil actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      
      const result = await userService.updateUserRole(id, roleId);
      
      res.json(ApiResponse.success(result, 'Rol actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      
      res.json(ApiResponse.success(result, 'Usuario eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};