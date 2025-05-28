const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, register } = require('../controllers/authController');

// Rate limiting configuration
const loginLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 5, // Limit each IP to 5 requests per window
  message: {
    error: 'Too many login attempts. Please try again later'
  },
  handler: (req, res) => {
    console.warn(`[RATE LIMIT] Blocked IP: ${req.ip} for ${req.originalUrl}`);
    res.status(429).json({
      error: 'Too many requests. Please try again later'
    });
  }
});

// @route   POST api/auth/login
// @access  Public
router.post('/login', loginLimiter, login);

// @route   POST api/auth/register
// @access  Public
router.post('/register', register);

module.exports = router;