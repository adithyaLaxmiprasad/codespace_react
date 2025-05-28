const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { dashboard, adminPanel } = require('../controllers/userController');

// @route   GET api/users/dashboard
// @access  Private (User/Admin)
router.get('/dashboard', auth, dashboard);

// @route   GET api/users/admin
// @access  Private (Admin only)
router.get('/admin', auth, role(['admin']), adminPanel);

module.exports = router;