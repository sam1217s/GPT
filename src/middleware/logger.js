// ===== src/middleware/logger.js =====
import { logger } from './errorHandler.js';

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?._id
    });

    return originalJson.call(this, data);
  };

  next();
};

export default loggerMiddleware;