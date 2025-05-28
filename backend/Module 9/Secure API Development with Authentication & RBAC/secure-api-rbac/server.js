require('dotenv').config();
const express = require('express');
const dbManager = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(env => {
  if (!process.env[env] && process.env.NODE_ENV !== 'test') {
    console.error(`❌ Critical error: Missing ${env} environment variable`);
    process.exit(1);
  }
});

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  dbManager.connect();
}

// Apply rate limiting to all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    status: 'UP',
    db: dbStatus,
    uptime: process.uptime(),
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heap: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}/${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`
    },
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Starting graceful shutdown...');
  
  try {
    await dbManager.disconnect();
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    
    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('Shutdown error:', error);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔐 Security features enabled: RBAC, JWT, Rate Limiting, Helmet`);
});

module.exports = { app, server }; // For testing