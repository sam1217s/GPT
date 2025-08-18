// ===== src/controllers/emailController.js =====
import { emailService } from '../services/emailService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export const emailController = {
  async sendProjectUpdate(req, res, next) {
    try {
      const { email, projectName, updateMessage, firstName } = req.body;
      
      await emailService.sendProjectUpdateEmail(email, projectName, updateMessage, firstName);
      
      res.json(ApiResponse.success(null, 'Email de actualización enviado'));
    } catch (error) {
      next(error);
    }
  },

  async sendCustomEmail(req, res, next) {
    try {
      const { to, subject, html, text } = req.body;
      
      await emailService.sendEmail(to, subject, html, text);
      
      res.json(ApiResponse.success(null, 'Email enviado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};