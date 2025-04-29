const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Scene = require('../../models/Scene');
require('dotenv').config();

// POST /scene/save-scene
router.post('/save-scene', async (req, res) => {
  try {
    // 1. Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: 'No token provided. Unauthorized.' });
    }

    // 2. Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 3. Get scene data from body
    const { brand, mixer, prompt, sceneName } = req.body;

    if (!brand || !mixer || !prompt || !sceneName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 4. Create and save new scene
    const newScene = new Scene({
      userId,
      brand,
      mixer,
      prompt,
      sceneName,
      createdAt: new Date(),
    });

    await newScene.save();

    // 5. Send response
    return res.status(201).json({ message: 'Scene saved successfully.' });
  } catch (err) {
    console.error('Error saving scene:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
