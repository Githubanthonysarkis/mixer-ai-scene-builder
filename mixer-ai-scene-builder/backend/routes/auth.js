// backend/routes/auth.js
require('dotenv').config(); // 1️⃣ ensure .env is loaded
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const transporter = require('../utils/mailer');
const { generateEmailVerificationToken } = require('../utils/token');

const router = express.Router();

// ─── Debug / Healthcheck ────────────────────────────────────────────
// Quick way to confirm this router is mounted:
router.get('/ping', (_req, res) => {
  res.json({ ok: true });
});

// ─── Test-Email Route ────────────────────────────────────────────────
// Freely send a test message to your own inbox:
router.get('/test-email', async (_req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Mixer AI – Test Email',
      text: 'If you see this, your SMTP setup works!',
    });
    console.log('🧪 Test email sent:', info.messageId);
    res.json({ message: '✅ Test email sent. Check your inbox.' });
  } catch (err) {
    console.error('🧪 Test email failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Signup Route ───────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  console.log('🚀 [Auth] POST /signup hit with payload:', req.body); // DEBUG

  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // 2. Prevent duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // 3. Hash & save
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log('✅ new user saved to MongoDB:', newUser._id);

    // 4. Generate verification token & link
    const token = generateEmailVerificationToken(newUser._id);
    const link = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${token}`;

    // 5. Send the email
    try {
      const info = await transporter.sendMail({
        envelope: {
          from: process.env.EMAIL_USER, // must match your SMTP login
          to: newUser.email, // or process.env.EMAIL_USER for test
        },
        // 2️⃣ Message headers (what end users see
        from: process.env.EMAIL_FROM,
        to: newUser.email,
        subject: 'Verify your Mixer AI account',
        text: `Click to verify: ${link}`,
        html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
      });
      console.log('✉️ Verification email sent:', info.messageId);
    } catch (mailErr) {
      console.error('❌ Error sending verification email:', mailErr);
      // note: we still return 201 so the user knows signup succeeded
    }

    // 6. Finally respond
    res.status(201).json({
      message:
        'Signup successful. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Login Route ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  console.log('🚀 [Auth] POST /login hit with payload:', req.body); // DEBUG

  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ error: 'Email not verified. Please check your inbox.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Issue JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Google OAuth Routes ────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // After successful Google login
    const { token } = req.user;
    res.redirect(
      `${process.env.FRONTEND_BASE_URL}/oauth-callback?token=${token}`
    );
  }
);

module.exports = router;
