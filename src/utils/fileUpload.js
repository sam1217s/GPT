import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import url from 'url';
import fs from 'fs';
import { ALLOWED_FILE_TYPES } from '../config/constants.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const uploadFile = (files, allowedExtensions = ALLOWED_FILE_TYPES.IMAGES) => {
  return new Promise((resolve, reject) => {
    if (!files || !files.archivo) {
      return reject('No se encontró archivo para subir');
    }

    const { archivo } = files;
    const fileName = archivo.name.split('.');
    const extension = fileName[fileName.length - 1].toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return reject(`Extensión ${extension} no permitida. Permitidas: ${allowedExtensions.join(', ')}`);
    }

    const tempName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../../uploads/', tempName);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(tempName);
    });
  });
};

export const deleteFile = (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../uploads/', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    return false;
  }
};

export const getFileUrl = (fileName) => {
  return `${process.env.API_BASE_URL}/uploads/${fileName}`;
};

