// ===== src/controllers/roleController.js =====
import Role from '../models/Role.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const roleController = {
  async getRoles(req, res, next) {
    try {
      const roles = await Role.find({ isActive: true }).sort({ name: 1 });
      
      res.json(ApiResponse.success(roles, 'Roles obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async createRole(req, res, next) {
    try {
      const role = new Role(req.body);
      await role.save();
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(role, 'Rol creado exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      
      const role = await Role.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!role) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Rol no encontrado')
        );
      }

      res.json(ApiResponse.success(role, 'Rol actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteRole(req, res, next) {
    try {
      const { id } = req.params;
      
      const role = await Role.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!role) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Rol no encontrado')
        );
      }

      res.json(ApiResponse.success(null, 'Rol eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};
