// @desc    User dashboard
// @route   GET /api/users/dashboard
exports.dashboard = (req, res) => {
  res.json({ 
    message: 'Welcome to your dashboard',
    user: req.user 
  });
};

// @desc    Admin panel
// @route   GET /api/users/admin
exports.adminPanel = (req, res) => {
  res.json({ 
    message: 'Welcome to Admin Panel',
    user: req.user 
  });
};