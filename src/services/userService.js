// ===== src/services/userService.js =====
import User from '../models/User.js';
import Role from '../models/Role.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';

export const userService = {
  async getAllUsers(query) {
    const { page, limit, skip } = getPaginationParams(query);
    
    const filter = { isActive: true };
    
    if (query.role) {
      filter.globalRole = query.role;
    }
    
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('globalRole')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return createPaginationResponse(users, total, page, limit);
  },

  async getUserById(userId) {
    const user = await User.findById(userId).populate('globalRole');
    if (!user || !user.isActive) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  },

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('globalRole');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user.toPublicJSON();
  },

  async updateUserRole(userId, roleId) {
    const role = await Role.findById(roleId);
    if (!role || !role.isActive) {
      throw new Error('Rol no encontrado');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { globalRole: roleId },
      { new: true }
    ).populate('globalRole');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user.toPublicJSON();
  },

  async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return { message: 'Usuario eliminado exitosamente' };
  }
};
