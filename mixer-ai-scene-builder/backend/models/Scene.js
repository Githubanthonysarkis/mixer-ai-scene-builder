const mongoose = require('mongoose');

// Define Scene schema
const sceneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  mixer: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  sceneName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically use current date
  },
});

// Export Scene model
module.exports = mongoose.model('Scene', sceneSchema);
