// ===== src/routes/uploads.js =====
import express from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { uploadAvatarValidator } from '../validators/uploadValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { validateFileUpload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import { ALLOWED_FILE_TYPES } from '../config/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Avatar upload/get
router.post('/avatar/:id',
  uploadAvatarValidator,
  handleValidationErrors,
  validateFileUpload(ALLOWED_FILE_TYPES.IMAGES),
  uploadController.uploadAvatar
);

router.get('/avatar/:id',
  uploadAvatarValidator,
  handleValidationErrors,
  uploadController.getAvatar
);

export default router;

