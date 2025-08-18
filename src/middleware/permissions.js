// ===== src/middleware/permissions.js =====
import { ApiResponse } from '../utils/apiResponse.js';
import { USER_ROLES } from '../config/constants.js';
import Project from '../models/Project.js';

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(ApiResponse.unauthorized());
    }

    const userRole = req.user.globalRole?.name;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json(ApiResponse.forbidden('Permisos insuficientes'));
    }

    next();
  };
};

export const requireAdmin = requireRole([USER_ROLES.ADMIN]);

export const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    
    if (!projectId) {
      return res.status(400).json(ApiResponse.error('ID de proyecto requerido'));
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json(ApiResponse.notFound('Proyecto no encontrado'));
    }

    // Admin siempre tiene acceso
    if (req.user.globalRole?.name === USER_ROLES.ADMIN) {
      req.project = project;
      return next();
    }

    // Verificar si es miembro o owner
    if (!project.isMember(req.user._id)) {
      return res.status(403).json(ApiResponse.forbidden('Acceso al proyecto denegado'));
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json(ApiResponse.error('Error verificando acceso al proyecto'));
  }
};

export const requireProjectOwner = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json(ApiResponse.notFound('Proyecto no encontrado'));
    }

    // Admin o owner tienen acceso
    if (req.user.globalRole?.name === USER_ROLES.ADMIN || 
        project.owner.toString() === req.user._id.toString()) {
      req.project = project;
      return next();
    }

    return res.status(403).json(ApiResponse.forbidden('Solo el propietario puede realizar esta acción'));
  } catch (error) {
    return res.status(500).json(ApiResponse.error('Error verificando propiedad del proyecto'));
  }
};

