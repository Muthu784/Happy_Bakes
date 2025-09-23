const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      
      // Ensure decoded token has required fields
      if (!decoded.id || !decoded.email || !decoded.role) {
        console.error('Invalid token payload:', decoded);
        return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
      }
      
      req.user = decoded;
      console.log('Authenticated user:', { id: decoded.id, email: decoded.email, role: decoded.role });
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    console.log('isAdmin middleware - User:', req.user); // Log user object
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }
    
    if (req.user.role !== 'admin') {
      console.log('User is not an admin. Role:', req.user.role);
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    
    console.log('Admin access granted for user:', req.user.email);
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error during admin check' });
  }
};

