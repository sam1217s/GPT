
// ===== src/controllers/uploadController.js =====
import { uploadService } from '../services/uploadService.js';
import User from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, ALLOWED_FILE_TYPES } from '../config/constants.js';

export const uploadController = {
  async uploadAvatar(req, res, next) {
    try {
      const { id } = req.params;
      const useCloudinary = req.query.cloud === 'true';

      let uploadResult;
      
      if (useCloudinary) {
        uploadResult = await uploadService.uploadToCloudinary(req.files, {
          folder: 'avatars',
          transformation: [{ width: 200, height: 200, crop: 'fill' }]
        });
      } else {
        uploadResult = await uploadService.uploadToServer(req.files, ALLOWED_FILE_TYPES.IMAGES);
      }

      // Actualizar usuario
      const user = await User.findById(id);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Usuario no encontrado')
        );
      }

      // Eliminar avatar anterior si existe
      if (user.avatar) {
        if (useCloudinary) {
          await uploadService.deleteFromCloudinary(user.avatar);
        } else {
          await uploadService.deleteFromServer(user.avatar);
        }
      }

      user.avatar = uploadResult.url;
      await user.save();

      res.json(ApiResponse.success({
        avatar: uploadResult.url,
        user: user.toPublicJSON()
      }, 'Avatar actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async getAvatar(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      if (!user || !user.avatar) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Avatar no encontrado')
        );
      }

      res.json(ApiResponse.success({ avatar: user.avatar }, 'Avatar obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};
