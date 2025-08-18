// ===== src/controllers/stateController.js =====
import State from '../models/State.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const stateController = {
  async getProjectStates(req, res, next) {
    try {
      const states = await State.find({ 
        type: 'Project', 
        isActive: true 
      }).sort({ order: 1 });
      
      res.json(ApiResponse.success(states, 'Estados de proyecto obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getTaskStates(req, res, next) {
    try {
      const states = await State.find({ 
        type: 'Task', 
        isActive: true 
      }).sort({ order: 1 });
      
      res.json(ApiResponse.success(states, 'Estados de tarea obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async createState(req, res, next) {
    try {
      const state = new State(req.body);
      await state.save();
      
      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(state, 'Estado creado exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async updateState(req, res, next) {
    try {
      const { id } = req.params;
      
      const state = await State.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!state) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Estado no encontrado')
        );
      }

      res.json(ApiResponse.success(state, 'Estado actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};
