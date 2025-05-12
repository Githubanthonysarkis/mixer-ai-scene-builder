const jwt = require('jsonwebtoken');

/**
 * Generates a short-lived token for email verification
 * @param {string} userId - The MongoDB user ID (_id)
 * @returns {string} - A signed JWT
 */
function generateEmailVerificationToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30m' } // expires in 30 minutes
  );
}

module.exports = {
  generateEmailVerificationToken,
};
