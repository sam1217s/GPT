
// ===== src/services/projectService.js =====
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import State from '../models/State.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';
import { emailService } from './emailService.js';

export const projectService = {
  async createProject(projectData, ownerId) {
    const defaultState = await State.findOne({ type: 'Project', order: 1 });
    
    const project = new Project({
      ...projectData,
      owner: ownerId,
      status: defaultState._id,
      category: projectData.categoryId
    });

    await project.save();
    await project.populate(['owner', 'category', 'status', 'members.user', 'members.role']);

    return project;
  },

  async getProjects(query, userId, userRole) {
    const { page, limit, skip } = getPaginationParams(query);
    
    const filter = { isActive: true };
    
    // Solo admin ve todos los proyectos
    if (userRole !== 'Admin') {
      filter.$or = [
        { owner: userId },
        { 'members.user': userId }
      ];
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } }
        ]
      });
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate(['owner', 'category', 'status', 'members.user', 'members.role'])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter)
    ]);

    return createPaginationResponse(projects, total, page, limit);
  },

  async getProjectById(projectId) {
    const project = await Project.findById(projectId)
      .populate(['owner', 'category', 'status', 'members.user', 'members.role']);

    if (!project || !project.isActive) {
      throw new Error('Proyecto no encontrado');
    }

    return project;
  },

  async updateProject(projectId, updateData) {
    const project = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    ).populate(['owner', 'category', 'status', 'members.user', 'members.role']);

    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    return project;
  },

  async addMember(projectId, userId, roleId) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    // Verificar si ya es miembro
    if (project.isMember(userId)) {
      throw new Error('El usuario ya es miembro del proyecto');
    }

    project.members.push({
      user: userId,
      role: roleId,
      joinedAt: new Date()
    });

    await project.save();
    await project.populate(['owner', 'category', 'status', 'members.user', 'members.role']);

    // Enviar email de invitación
    const user = await User.findById(userId);
    await emailService.sendProjectInvitationEmail(user.email, project.name, user.firstName);

    return project;
  },

  async removeMember(projectId, userId) {
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    project.members = project.members.filter(
      member => member.user.toString() !== userId.toString()
    );

    await project.save();
    await project.populate(['owner', 'category', 'status', 'members.user', 'members.role']);

    return project;
  },

  async deleteProject(projectId) {
    // Soft delete del proyecto y sus tareas
    await Promise.all([
      Project.findByIdAndUpdate(projectId, { isActive: false }),
      Task.updateMany({ project: projectId }, { isActive: false })
    ]);

    return { message: 'Proyecto eliminado exitosamente' };
  }
};
