// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const generateSceneRoutes = require('./routes/scene/generate');
const saveSceneRoutes = require('./routes/scene/save');
const userScenesRoutes = require('./routes/scene/userScenes');
const verifyEmailRoute = require('./routes/verifyEmail');
const passport = require('./config/passport');

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/scene', generateSceneRoutes);
app.use('/scene', saveSceneRoutes);
app.use('/scene', userScenesRoutes); //fetches scenes in user's dashboard
app.use('/verify-email', verifyEmailRoute);

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
