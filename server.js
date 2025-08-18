import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

// Import configurations
import connectDB from './src/config/database.js';
import './src/config/cloudinary.js';

// Import middleware
import rateLimitMiddleware from './src/middleware/rateLimit.js';
import errorHandler from './src/middleware/errorHandler.js';
import loggerMiddleware from './src/middleware/logger.js';

// Import routes
import routes from './src/routes/index.js';

// Import seeders
import runSeeders from './src/seeders/runAllSeeders.js';





const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded'
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(loggerMiddleware);

// Rate limiting
app.use(rateLimitMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', routes);

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Run seeders if enabled
    if (process.env.RUN_SEEDERS === 'true') {
      await runSeeders();
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode
📍 Port: ${PORT}
🌐 URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}
📚 API: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api
🏥 Health: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/health
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;