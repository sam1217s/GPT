// ===== src/routes/comments.js =====
import express from 'express';
import { commentController } from '../controllers/commentController.js';
import { 
  createCommentValidator, 
  updateCommentValidator, 
  commentIdValidator 
} from '../validators/commentValidators.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireProjectAccess } from '../middleware/permissions.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Update comment
router.put('/:id',
  updateCommentValidator,
  handleValidationErrors,
  commentController.updateComment
);

// Delete comment
router.delete('/:id',
  commentIdValidator,
  handleValidationErrors,
  commentController.deleteComment
);

export default router;

