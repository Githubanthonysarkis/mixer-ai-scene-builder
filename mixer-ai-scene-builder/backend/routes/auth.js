const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Simulated in-memory users "database"
const users = [];

// Signup route
router.post('/signup', async (req, res) => {
  try {
    let { email, password } = req.body;

    // 1. Always lowercase email
    email = email.toLowerCase();

    // 2. Check if user already exists in MongoDB
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user instance
    const newUser = new User({ email, password: hashedPassword });

    // 5. Save to MongoDB
    await newUser.save();
    console.log('new user saved to mongoDB');

    // 6. Return success
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // 1. Always lowercase the email
    email = email.toLowerCase();

    // 2. Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. If passwords match ➔ generate token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Send token
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
