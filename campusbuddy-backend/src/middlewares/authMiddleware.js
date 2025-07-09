const jwt = require('jsonwebtoken'); // Import JWT library

const authMiddleware = (req, res, next) => {
  // Get the Authorization header (should be "Bearer <token>")
  const authHeader = req.headers['authorization'];
  // Extract the token part
  const token = authHeader && authHeader.split(' ')[1];

  // If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user ID to the request object
    req.user = decoded.userId;
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired, deny access
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware; // Export the middleware