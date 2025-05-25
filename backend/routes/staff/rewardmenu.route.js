const express = require("express");
const rewardPoints = express.Router();

const {
  getAllRewardItems,
  getRewardItemById,
  addRewardItem,
  updateRewardItem,
  deleteRewardItem,
  getAvailableRewardItems,
  toggleRewardAvailability,
  getRewardItemsByType,
  getRewardItemsByCategory,
} = require("../../controllers/staff/RewardMenu.js");

// Use Memory Storage for file uploads
const upload = require('../../utils/multer.js');

// Get all reward items (can filter with ?available=true or ?available=false)
rewardPoints.get("/get-all-rewards", getAllRewardItems);

// Get only available reward items
rewardPoints.get("/available-rewards", getAvailableRewardItems);

// Get reward items by type (vegetarian, non-vegetarian, drinks)
rewardPoints.get("/type/:type", getRewardItemsByType);

// Get reward items by category
rewardPoints.get("/category/:category", getRewardItemsByCategory);

// Get a single reward item by ID
rewardPoints.get("/get-single-reward/:id", getRewardItemById);

// Add a new reward item
rewardPoints.post("/add-reward-item", upload.single("image"), addRewardItem);

// Update a reward item
rewardPoints.put("/update-reward/:id", upload.single("image"), updateRewardItem);

// Toggle reward item availability
rewardPoints.patch("/toggle-availability/:id", toggleRewardAvailability);

// Delete a reward item
rewardPoints.delete("/delete-reward/:id", deleteRewardItem);

module.exports = rewardPoints;