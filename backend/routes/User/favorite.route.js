const express = require("express");
const favoritesRouter = express.Router();
const { authenticateUser } = require("../../middleware/authMiddleware");
const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} = require("../../controllers/User/Favorite");

// Protected routes (require authentication)
favoritesRouter.post("/add", authenticateUser, addToFavorites);
favoritesRouter.delete("/remove", authenticateUser, removeFromFavorites);
favoritesRouter.get("/user-favorites", authenticateUser, getUserFavorites);

module.exports = favoritesRouter;