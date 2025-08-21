const express = require("express");
const passport = require("../config/passport");

const router = express.Router();

// Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// GitHub OAuth login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
