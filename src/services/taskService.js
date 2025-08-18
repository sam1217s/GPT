// ===== src/services/taskService.js =====
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import State from '../models/State.js';
import User from '../models/User.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';
import { emailService } from './emailService.js';

export const taskService = {
  async createTask(taskData, projectId, createdById) {
    const defaultState = await State.findOne({ type: 'Task', order: 1 });
    
    const task = new Task({
      ...taskData,
      project: projectId,
      createdBy: createdById,
      status: defaultState._id
    });

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy', 'status']);

    // Enviar email si hay usuario asignado
    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo);
      const project = await Project.findById(projectId);
      await emailService.sendTaskAssignedEmail(
        assignedUser.email, 
        task.title, 
        project.name, 
        assignedUser.firstName
      );
    }

    return task;
  },

  async getProjectTasks(projectId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    
    const filter = { project: projectId, isActive: true };

    if (query.assignedTo) {
      filter.assignedTo = query.assignedTo;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate(['assignedTo', 'createdBy', 'status'])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    return createPaginationResponse(tasks, total, page, limit);
  },

  async getUserTasks(userId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    
    const filter = { assignedTo: userId, isActive: true };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate(['project', 'status'])
        .sort({ dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    return createPaginationResponse(tasks, total, page, limit);
  },

  async getTaskById(taskId) {
    const task = await Task.findById(taskId)
      .populate(['project', 'assignedTo', 'createdBy', 'status']);

    if (!task || !task.isActive) {
      throw new Error('Tarea no encontrada');
    }

    return task;
  },

  async updateTask(taskId, updateData) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate(['project', 'assignedTo', 'createdBy', 'status']);

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    return task;
  },

  async assignTask(taskId, userId) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: userId },
      { new: true }
    ).populate(['project', 'assignedTo', 'createdBy', 'status']);

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    // Enviar email de asignación
    if (userId) {
      const user = await User.findById(userId);
      await emailService.sendTaskAssignedEmail(
        user.email, 
        task.title, 
        task.project.name, 
        user.firstName
      );
    }

    return task;
  },

  async deleteTask(taskId) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { isActive: false },
      { new: true }
    );

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    return { message: 'Tarea eliminada exitosamente' };
  }
};
