// ===== src/controllers/categoryController.js =====
import Category from '../models/Category.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination.js';

export const categoryController = {
  async getCategories(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      
      const filter = { isActive: true };
      
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const [categories, total] = await Promise.all([
        Category.find(filter)
          .populate('createdBy', 'firstName lastName')
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit),
        Category.countDocuments(filter)
      ]);

      const result = createPaginationResponse(categories, total, page, limit);
      
      res.json(ApiResponse.success(result, 'Categorías obtenidas exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const category = new Category({
        ...req.body,
        createdBy: req.user._id
      });

      await category.save();
      await category.populate('createdBy', 'firstName lastName');

      res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success(category, 'Categoría creada exitosamente', HTTP_STATUS.CREATED)
      );
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('createdBy', 'firstName lastName');

      if (!category) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Categoría no encontrada')
        );
      }

      res.json(ApiResponse.success(category, 'Categoría actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!category) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          ApiResponse.notFound('Categoría no encontrada')
        );
      }

      res.json(ApiResponse.success(null, 'Categoría eliminada exitosamente'));
    } catch (error) {
      next(error);
    }
  }
};