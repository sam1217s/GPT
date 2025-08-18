// ===== src/controllers/projectController.js =====
import { projectService } from '../services/projectService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const projectController = {
  async createProject(req, res, next) {
    try {
      const result = await projectService.createProject(req.body, req.user._id);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(result, 'Proyecto creado exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async getProjects(req, res, next) {
    try {
      const result = await projectService.getProjects(
        req.query, 
        req.user._id, 
        req.user.globalRole?.name
      );
      
      res.json(ApiResponse.success(result, 'Proyectos obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await projectService.getProjectById(id);
      
      res.json(ApiResponse.success(result, 'Proyecto obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const result = await projectService.updateProject(id, req.body);
      
      res.json(ApiResponse.success(result, 'Proyecto actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, roleId } = req.body;
      
      const result = await projectService.addMember(id, userId, roleId);
      
      res.json(ApiResponse.success(result, 'Miembro agregado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req, res, next) {
    try {
      const { id, userId } = req.params;
      
      const result = await projectService.removeMember(id, userId);
      
      res.json(ApiResponse.success(result, 'Miembro removido exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const result = await projectService.deleteProject(id);
      
      res.json(ApiResponse.success(result, 'Proyecto eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};
