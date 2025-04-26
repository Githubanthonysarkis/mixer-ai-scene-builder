const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // needed to verify the user
// const Scene = require('../models/scene');
require('dotenv').config();

router.post('/save-scene', async (req, res) => {
  try {
    // 1. Verify Token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    //2. extrsct scene data from request body
    const { brand, mixer, prompt } = req.body;
    if (!brand || !mixer || !prompt) {
      return res
        .status(400)
        .json({ error: 'All fields are required: brand, mixer, and prompt.' });
    }

    //3. Create a new scene object
    const newScene = new Scene({
      userId,
      brand,
      mixer,
      prompt,
      sceneName,
      createdate: new Date(),
    });
    await newScene.save();
    res.status(201).json({ message: 'Scene saved successfully' });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: 'Internal server error. scene could not be saved' });
  }
});

module.exports = router;
