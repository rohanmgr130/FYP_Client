const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  verifyEmail, 
  resendVerificationEmail 
} = require('../../controllers/User/Register');

// Register new user
router.post('/register', registerUser);

// Verify email
router.get('/verify/:token', verifyEmail);

// Resend verification email
router.post('/resend-verification', resendVerificationEmail);

// Add your login route here
// router.post('/login', login);

// Add your forgot password route here
// router.post('/forgot-password', forgotPassword);

// Add your reset password route here
// router.post('/reset-password/:token', resetPassword);

// Add your logout route here
// router.post('/logout', authenticateUser, logout);

module.exports = router;

// In your main app.js or server.js file:
// app.use("/api/auth", authRoutes);