const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 🔐 GET /verify-email?token=abc123
router.get('/', async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is missing.' });
    }

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 🔍 Find the user and update verification status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Account already verified.' });
    }

    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
});

module.exports = router;
