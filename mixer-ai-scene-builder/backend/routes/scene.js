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

  const sceneData = {
    brand,
    mixer,
    prompt,
    createdAt: new Date().toISOString(),
  };
  const fileName = `${mixer.replace(/\s+/g, '_')}_scene.json`;
  const fileContent = JSON.stringify(sceneData, null, 2);

  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/json');

  return res.send(fileContent);
});

module.exports = router;
