// Higher-order function for role-based access control
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access forbidden: Insufficient permissions' 
      });
    }
    next();
  };
};