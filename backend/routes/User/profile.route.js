const express = require('express');
const profileRouter = express.Router();
const { 
  getUser, 
  updateProfile, 
  changePassword, 
  deleteProfileImage, 
  upload 
} = require('../../controllers/User/Profile'); 
const { authenticateUser } = require('../../middleware/authMiddleware'); 

// Route to get user profile - protected by authentication
profileRouter.get('/profile/:id', authenticateUser, getUser);

// Route to update user profile (name and image) - protected by authentication
profileRouter.put('/update', authenticateUser, upload.single('profileImage'), updateProfile);

// Route to change password - protected by authentication
profileRouter.put('/change-password', authenticateUser, changePassword);

// Route to delete profile image - protected by authentication
profileRouter.delete('/delete-image', authenticateUser, deleteProfileImage);

module.exports = profileRouter;