// backend/server.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const generateSceneRoutes = require('./routes/scene/generate');
const saveSceneRoutes = require('./routes/scene/save');
require('dotenv').config();

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/scene', generateSceneRoutes);
app.use('/scene', saveSceneRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Mixer AI Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
