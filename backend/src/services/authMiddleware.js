const jwt = require('jsonwebtoken');
const authService = require('./authService');

/**
 * Middleware to protect routes
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const user = await authService.verifyToken(token);
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware to restrict access to admin users
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access forbidden: Admin privileges required' });
  }
};

module.exports = {
  authenticateUser,
  authorizeAdmin
}; 