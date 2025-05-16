// backend/utils/mailer.js

// 1️⃣ Make sure .env is loaded in case this file is required early
require('dotenv').config();

const nodemailer = require('nodemailer');

// 2️⃣ Destructure and validate
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    'Missing SMTP configuration in .env: please define EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS'
  );
}

// 3️⃣ Create transporter without any replace() on undefined
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT, 10),
  secure: EMAIL_PORT === '465', // true if using port 465 (SSL), false otherwise
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// 4️⃣ Optional sanity check on startup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Mailer failed to connect:', err);
  } else {
    console.log('✅ Mailer is ready to send messages');
  }
});

module.exports = transporter;
