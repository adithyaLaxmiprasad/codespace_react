const { performance } = require('perf_hooks');

// Middleware to ensure user exists
const verifyUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
  }
  next();
};

// @desc    User dashboard
// @route   GET /api/users/dashboard
exports.dashboard = [
  verifyUser,
  async (req, res) => {
    const startTime = performance.now();
    
    try {
      // Fetch fresh user data with only necessary fields
      const user = await req.userModel
        .findById(req.user.userId)
        .select('username role createdAt lastLogin')
        .lean();
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Performance logging
      const endTime = performance.now();
      console.log(`[PERF] Dashboard processed in ${(endTime - startTime).toFixed(2)}ms`);
      
      res.json({ 
        message: 'Welcome to your dashboard',
        user: {
          username: user.username,
          role: user.role,
          memberSince: user.createdAt,
          lastLogin: user.lastLogin || 'Never'
        }
      });
    } catch (err) {
      console.error('[DASHBOARD ERROR]', err.message);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  }
];

// @desc    Admin panel
// @route   GET /api/users/admin
exports.adminPanel = [
  verifyUser,
  async (req, res) => {
    // Explicit role check (additional layer)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    try {
      const startTime = performance.now();
      
      // Get admin statistics
      const [userCount, activeUsers] = await Promise.all([
        req.userModel.countDocuments(),
        req.userModel.countDocuments({ lastLogin: { $gt: new Date(Date.now() - 7*24*60*60*1000) } })
      ]);
      
      // Performance logging
      const endTime = performance.now();
      console.log(`[PERF] Admin panel processed in ${(endTime - startTime).toFixed(2)}ms`);
      
      res.json({ 
        message: 'Welcome to Admin Panel',
        stats: {
          totalUsers: userCount,
          activeUsers,
          uptime: process.uptime()
        }
      });
    } catch (err) {
      console.error('[ADMIN PANEL ERROR]', err.message);
      res.status(500).json({ error: 'Failed to load admin panel' });
    }
  }
];

// Inject model dependency for testability
exports.setModel = (model) => {
  this.userModel = model;
};