// ===== src/routes/index.js =====
import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import roleRoutes from './roles.js';
import categoryRoutes from './categories.js';
import projectRoutes from './projects.js';
import taskRoutes from './tasks.js';
import commentRoutes from './comments.js';
import stateRoutes from './states.js';
import uploadRoutes from './uploads.js';
import aiRoutes from './ai.js';
import emailRoutes from './emails.js';

const router = express.Router();

// API version
router.get('/', (req, res) => {
  res.json({
    message: 'Project Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      roles: '/api/roles',
      categories: '/api/categories',
      projects: '/api/projects',
      tasks: '/api/tasks',
      comments: '/api/comments',
      states: '/api/states',
      uploads: '/api/uploads',
      ai: '/api/ai',
      emails: '/api/emails'
    }
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/categories', categoryRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/states', stateRoutes);
router.use('/uploads', uploadRoutes);
router.use('/ai', aiRoutes);
router.use('/emails', emailRoutes);

export default router;