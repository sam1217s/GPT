// ===== src/services/uploadService.js =====
import cloudinary from '../config/cloudinary.js';
import { uploadFile, deleteFile, getFileUrl } from '../utils/fileUpload.js';
import { ALLOWED_FILE_TYPES } from '../config/constants.js';

export const uploadService = {
  async uploadToServer(files, allowedTypes = ALLOWED_FILE_TYPES.IMAGES) {
    try {
      const fileName = await uploadFile(files, allowedTypes);
      const fileUrl = getFileUrl(fileName);
      
      return {
        fileName,
        url: fileUrl,
        type: 'server'
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  async uploadToCloudinary(files, options = {}) {
    try {
      const { archivo } = files;
      
      const uploadOptions = {
        folder: 'project-management',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:best' }
        ],
        ...options
      };

      const result = await cloudinary.uploader.upload(
        archivo.tempFilePath,
        uploadOptions
      );

      return {
        fileName: result.public_id,
        url: result.secure_url,
        type: 'cloudinary'
      };
    } catch (error) {
      throw new Error('Error subiendo archivo a Cloudinary');
    }
  },

  async deleteFromServer(fileName) {
    return deleteFile(fileName);
  },

  async deleteFromCloudinary(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error eliminando de Cloudinary:', error);
      return false;
    }
  }
};
