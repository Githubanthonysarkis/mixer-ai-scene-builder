// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secretkey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretkey);
    req.user = decoded;
    next(); // ✅ Proceed to the next route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;
