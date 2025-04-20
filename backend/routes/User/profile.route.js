const express = require('express');
const profileRouter = express.Router();
const { getUser } = require('../../controllers/User/Profile'); // Adjust path as needed
// Route to get user profile - protected by authentication
profileRouter.get('/profile', getUser);

module.exports = profileRouter;