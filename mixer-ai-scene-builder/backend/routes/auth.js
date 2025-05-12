const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../utils/mailer');
const { generateEmailVerificationToken } = require('../utils/token');

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

    const token = generateEmailVerificationToken(newUser._id);
    const link = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"Mixer AI Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Mixer AI account',
      html: `
        <h3>Welcome to Mixer AI 🎚️</h3>
        <p>Click the button below to verify your email:</p>
        <a href="${link}" style="padding:10px 20px; background:#007bff; color:white;">Verify My Email</a>
        <p>This link expires in 30 minutes.</p>
      `,
    });

    // 6. Return success
    return res.status(201).json({
      message:
        'Signup successful. Please check your email to verify your account.',
    });
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

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ error: 'Email not verified.Please check your inobx' });
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
      { expiresIn: '1d' }
    );

    // 5. Send token
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
