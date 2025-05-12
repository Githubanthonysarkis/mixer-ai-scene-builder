// backend/middleware/ensureVerified.js
module.exports = function ensureVerified(req, res, next) {
  if (!req.user?.isVerified) {
    return res.status(403).json({ error: 'Account not verified.' });
  }
  next();
};
