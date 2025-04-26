const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Simulated in-memory users "database"
const users = [];

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if email is already taken
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ error: 'Email already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), email, password: hashedPassword };

  users.push(newUser);
  res.status(201).json({ message: 'User created successfully' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user)
    return res
      .status(401)
      .json({ error: 'Invalid credentials, user is not registered' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, 'JWT_SECRET', {
    expiresIn: '1h',
  });

  res.json({ message: 'Login successful', token });
});

module.exports = router;
