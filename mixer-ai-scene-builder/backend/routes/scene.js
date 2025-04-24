const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  const { brand, mixer, prompt } = req.body;

  if (!brand || !mixer || !prompt) {
    return res
      .status(400)
      .json({ error: 'All fields are required: brand, mixer, and prompt.' });
  }
  console.log('🎛️ Scene generation request received:');
  console.log(`Brand: ${brand}`);
  console.log(`Mixer: ${mixer}`);
  console.log(`Prompt: ${prompt}`);
  // Mock result (later replaced with AI or actual file generation)
  const mockSceneData = {
    success: true,
    message: `Scene created for ${mixer} (${brand}) with your custom configuration.`,
  };

  res.json(mockSceneData);
});

module.exports = router;
