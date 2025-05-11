const express = require('express');
const profileRouter = express.Router();
const { getUser } = require('../../controllers/User/Profile'); 
const { authenticateUser } = require('../../middleware/authMiddleware'); 
// Route to get user profile - protected by authentication

profileRouter.get('/profile/:id', authenticateUser, getUser);



module.exports = profileRouter;