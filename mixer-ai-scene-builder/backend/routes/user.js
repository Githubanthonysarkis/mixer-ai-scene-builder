const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Example: protected route for dashboard data
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard!',
    user: req.user,
  });
});

module.exports = router;
