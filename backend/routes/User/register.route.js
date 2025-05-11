const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  verifyEmail, 
  resendVerificationEmail 
} = require('../../controllers/User/Register');
const loginUser = require('../../controllers/User/Login');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify/email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

module.exports = router;