const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  verifyEmail, 
  resendVerificationEmail 
} = require('../../controllers/User/Register');
const loginUser = require('../../controllers/User/Login');
const { 
  forgotPassword, 
  resetPassword, 
  verifyResetToken 
} = require('../../controllers/User/ForgetPassword');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify/email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken); // Optional: to check token validity

module.exports = router;