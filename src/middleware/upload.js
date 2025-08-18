// ===== src/middleware/upload.js =====
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../config/constants.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const validateFileUpload = (allowedTypes = ALLOWED_FILE_TYPES.IMAGES) => {
  return (req, res, next) => {
    // Buscar archivo con diferentes nombres posibles
    const file = req.files?.archivo || req.files?.file || req.files?.avatar || req.files?.image;
    
    if (!req.files || !file) {
      return res.status(400).json(ApiResponse.error('No se encontró archivo para subir'));
    }

    // Normalizar para que siempre sea 'archivo'
    if (!req.files.archivo) {
      req.files.archivo = file;
    }
    
    const { archivo } = req.files;
    
    // Resto del código igual...
    if (archivo.size > MAX_FILE_SIZE) {
      return res.status(400).json(ApiResponse.error('Archivo demasiado grande'));
    }

    const fileName = archivo.name.split('.');
    const extension = fileName[fileName.length - 1].toLowerCase();
    
    if (!allowedTypes.includes(extension)) {
      return res.status(400).json(
        ApiResponse.error(`Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`)
      );
    }

    next();
  };
};