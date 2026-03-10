import express from "express";
import { register, login, verifyEmail, resendVerificationEmail, googleCallback } from "../controllers/authController.js";
import passport from "../config/passport.js";

const router = express.Router();

// Local authentication
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Google OAuth authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=oauth_failed`,
  }),
  googleCallback
);

export default router;