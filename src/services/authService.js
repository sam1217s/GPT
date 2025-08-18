// ===== src/services/authService.js =====
import User from '../models/User.js';
import Role from '../models/Role.js';
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyToken } from '../utils/jwt.js';
import { hashPassword } from '../utils/bcrypt.js';
import { emailService } from './emailService.js';
import { USER_ROLES } from '../config/constants.js';

export const authService = {
  async register(userData) {
    const defaultRole = await Role.findOne({ name: USER_ROLES.DEVELOPER });
    
    const user = new User({
      ...userData,
      globalRole: defaultRole._id
    });

    await user.save();
    await user.populate('globalRole');

    // Enviar email de bienvenida
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Guardar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toPublicJSON(),
      tokens: { accessToken, refreshToken }
    };
  },

  async login(email, password) {
    const user = await User.findOne({ email, isActive: true })
      .select('+password')
      .populate('globalRole');

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Credenciales inválidas');
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Actualizar último login y refresh token
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toPublicJSON(),
      tokens: { accessToken, refreshToken }
    };
  },

  async refreshToken(token) {
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findOne({ 
      _id: decoded.userId, 
      refreshToken: token, 
      isActive: true 
    }).populate('globalRole');

    if (!user) {
      throw new Error('Token de refresh inválido');
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      user: user.toPublicJSON(),
      tokens: { accessToken, refreshToken: newRefreshToken }
    };
  },

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { 
      $unset: { refreshToken: 1 } 
    });
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const resetToken = generateResetToken({ userId: user._id });
    await emailService.sendPasswordResetEmail(email, resetToken, user.firstName);

    return { message: 'Email de recuperación enviado' };
  },

  async resetPassword(token, newPassword) {
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'reset_password') {
      throw new Error('Token inválido');
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('Usuario no encontrado');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Contraseña actualizada exitosamente' };
  }
};





