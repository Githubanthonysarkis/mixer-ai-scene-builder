const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const ensureVerified = require('../middleware/ensureVerified');

const router = express.Router();

/**
 * GET /user/dashboard
 * 1️⃣ verifyToken   → validates JWT and populates req.user
 * 2️⃣ ensureVerified → blocks if user.isVerified === false
 * 3️⃣ handler       → only runs for verified users
 */
router.get(
  '/dashboard',
  verifyToken, // 🔐 makes req.user
  ensureVerified, // 🚦 blocks unverified
  (req, res) => {
    res.json({
      message: 'Welcome to your dashboard!',
      user: req.user, // safe to expose now
    });
  }
);

module.exports = router;
