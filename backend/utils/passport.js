const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            username: profile.displayName.replace(/\s+/g, "").toLowerCase(),
            email: profile.emails[0].value,
            password: Math.random().toString(36), // dummy password (won’t be used)
            profile: profile.photos[0].value,
          });
        }

        // issue JWT
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "3d",
        });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.username}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            username: profile.username,
            email,
            password: Math.random().toString(36),
            profile: profile.photos[0].value,
          });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "3d",
        });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
