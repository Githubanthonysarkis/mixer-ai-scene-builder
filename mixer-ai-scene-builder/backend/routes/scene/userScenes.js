const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/authMiddleware');
const Scene = require('../../models/Scene');

// GET /scene/user-scenes
router.get('/user-scenes', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Set by verifyToken middleware
    const scenes = await Scene.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ scenes });
  } catch (err) {
    console.error('❌ Error fetching user scenes:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
