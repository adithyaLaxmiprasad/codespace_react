const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// @route   POST api/auth/login
// @access  Public
router.post('/login', login);

// @route   POST api/auth/register
// @access  Public
router.post('/register', register);

module.exports = router;