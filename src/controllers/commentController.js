// ===== src/controllers/commentController.js =====
import Comment from '../models/Comment.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';

export const commentController = {
  async getProjectComments(req, res, next) {
    try {
      const { id } = req.params;
      const { page, limit, skip } = getPaginationParams(req.query);

      const [comments, total] = await Promise.all([
        Comment.find({ projectId: id })
          .populate('author', 'firstName lastName avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Comment.countDocuments({ projectId: id })
      ]);

      const result = createPaginationResponse(comments, total, page, limit);
      
      res.json(ApiResponse.success(result, 'Comentarios obtenidos exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async createComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const comment = new Comment({
        content,
        author: req.user._id,
        projectId: id
      });

      await comment.save();
      await comment.populate('author', 'firstName lastName avatar');

      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(comment, 'Comentario creado exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Comentario no encontrado')
        );
      }

      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('Solo puedes editar tus propios comentarios')
        );
      }

      comment.content = content;
      comment.editedAt = new Date();
      await comment.save();
      await comment.populate('author', 'firstName lastName avatar');

      res.json(ApiResponse.success(comment, 'Comentario actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Comentario no encontrado')
        );
      }

      if (comment.author.toString() !== req.user._id.toString() && 
          req.user.globalRole?.name !== 'Admin') {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          ApiResponse.forbidden('No tienes permisos para eliminar este comentario')
        );
      }

      await Comment.findByIdAndDelete(id);

      res.json(ApiResponse.success(null, 'Comentario eliminado exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};