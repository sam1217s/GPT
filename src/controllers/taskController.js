// ===== src/controllers/taskController.js =====
import { taskService } from '../services/taskService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const taskController = {
  async createTask(req, res, next) {
    try {
      const { projectId } = req.params;
      const result = await taskService.createTask(req.body, projectId, req.user._id);
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(result, 'Tarea creada exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async getProjectTasks(req, res, next) {
    try {
      const { projectId } = req.params;
      const result = await taskService.getProjectTasks(projectId, req.query);
      
      res.json(ApiResponse.success(result, 'Tareas obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getUserTasks(req, res, next) {
    try {
      const result = await taskService.getUserTasks(req.user._id, req.query);
      
      res.json(ApiResponse.success(result, 'Mis tareas obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await taskService.getTaskById(id);
      
      res.json(ApiResponse.success(result, 'Tarea obtenida exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const result = await taskService.updateTask(id, req.body);
      
      res.json(ApiResponse.success(result, 'Tarea actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async assignTask(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      const result = await taskService.assignTask(id, userId);
      
      res.json(ApiResponse.success(result, 'Tarea asignada exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const result = await taskService.deleteTask(id);
      
      res.json(ApiResponse.success(result, 'Tarea eliminada exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};