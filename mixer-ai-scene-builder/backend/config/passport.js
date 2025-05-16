// backend/config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    // 🔍 This function runs after Google authenticates the user
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1️⃣ Attempt to find an existing user by their Google ID
        let user = await User.findOne({ googleId: profile.id });

        // 2️⃣ If not found, see if someone signed up with this email
        const email = profile.emails[0].value.toLowerCase();
        if (!user) {
          user = await User.findOne({ email });
        }

        // 3️⃣ If there’s still no user, create a brand-new one
        if (!user) {
          user = new User({
            email,
            googleId: profile.id,
            isVerified: true, // OAuth users skip email step
            password: '', // no local password needed
          });
          await user.save();
        }
        // 4️⃣ If we found a user without a googleId, link it
        else if (!user.googleId) {
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        }

        // 5️⃣ Create the same JWT you use for password logins
        const token = jwt.sign(
          { id: user._id.toString(), email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        // 6️⃣ Pass the user and token into Passport’s callback
        done(null, { user, token });
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
