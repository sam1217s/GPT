// ===== src/controllers/aiController.js (CORREGIDO) =====
import { aiService } from '../services/aiService.js';
import { taskService } from '../services/taskService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';

export const aiController = {
  async generateTasks(req, res, next) {
    try {
      const { projectDescription, projectName } = req.body;
      
      const tasks = await aiService.generateTasks(projectDescription, projectName);
      
      res.json(ApiResponse.success(tasks, 'Tareas generadas exitosamente con IA'));
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.error(error.message, HTTP_STATUS.BAD_REQUEST)
      );
    }
  },

  async analyzeProject(req, res, next) {
    try {
      const { projectId } = req.body;
      
      const [project, tasks] = await Promise.all([
        Project.findById(projectId).populate(['category', 'status']),
        Task.find({ project: projectId, isActive: true })
      ]);

      if (!project) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Proyecto no encontrado')
        );
      }

      const analysis = await aiService.analyzeProject(project, tasks);
      
      res.json(ApiResponse.success(analysis, 'Análisis de proyecto completado con IA'));
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.error(error.message, HTTP_STATUS.BAD_REQUEST)
      );
    }
  },

  async estimateTime(req, res, next) {
    try {
      const { taskDescription, taskType } = req.body;
      
      const estimation = await aiService.estimateTaskTime(taskDescription, taskType);
      
      res.json(ApiResponse.success(estimation, 'Estimación de tiempo completada con IA'));
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.error(error.message, HTTP_STATUS.BAD_REQUEST)
      );
    }
  },

  async generateSummary(req, res, next) {
    try {
      const { projectId } = req.body;
      
      const [project, tasks, comments] = await Promise.all([
        Project.findById(projectId).populate(['category', 'status']),
        Task.find({ project: projectId, isActive: true }),
        Comment.find({ projectId }).sort({ createdAt: -1 }).limit(10)
      ]);

      if (!project) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Proyecto no encontrado')
        );
      }

      const summary = await aiService.generateProjectSummary(project, tasks, comments);
      
      res.json(ApiResponse.success(summary, 'Resumen de proyecto generado con IA'));
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(
        ApiResponse.error(error.message, HTTP_STATUS.BAD_REQUEST)
      );
    }
  },

  // Endpoint para probar conexión con IA
  async testConnection(req, res, next) {
    try {
      const result = await aiService.testConnection();
      
      if (result.success) {
        res.json(ApiResponse.success(result, 'Conexión con IA exitosa'));
      } else {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
          ApiResponse.error(result.message, HTTP_STATUS.BAD_REQUEST)
        );
      }
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        ApiResponse.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
    }
  }
};