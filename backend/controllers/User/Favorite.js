const Favorites = require("../../models/user/Favorites");
const Menu = require("../../models/staff/menu"); // Make sure this points to your actual Menu model
const mongoose = require('mongoose');

// Get a single menu item by ID (moved out of the addToFavorites function)
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu item", error });
  }
};

// Add item to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    // Validate if itemId is provided
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format"
      });
    }

    // Find favorites list for user
    let favorites = await Favorites.findOne({ user: userId });

    if (!favorites) {
      // Create new favorites list if it doesn't exist
      favorites = new Favorites({
        user: userId,
        items: [itemId]
      });
      await favorites.save();
      
      return res.status(200).json({
        success: true,
        message: "Item added to favorites",
        favorites
      });
    } 
    
    // Check if item already exists in favorites using string comparison
    const itemExists = favorites.items.some(item => 
      item.toString() === itemId.toString()
    );
    
    if (itemExists) {
      return res.status(200).json({  // Changed from 400 to 200
        success: true,               // Changed from false to true
        message: "Item already in favorites"
      });
    }
    
    // Add item to favorites
    favorites.items.push(itemId);
    await favorites.save();

    return res.status(200).json({
      success: true,
      message: "Item added to favorites",
      favorites
    });

  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to favorites"
    });
  }
};

// Remove item from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format"
      });
    }

    const favorites = await Favorites.findOne({ user: userId });

    if (!favorites) {
      return res.status(404).json({
        success: false,
        message: "Favorites list not found"
      });
    }

    // Convert itemId to string for comparison
    const itemIdStr = itemId.toString();
    
    // Check if item exists in favorites
    const itemIndex = favorites.items.findIndex(item => 
      item.toString() === itemIdStr
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in favorites"
      });
    }

    // Remove item from array
    favorites.items.splice(itemIndex, 1);
    await favorites.save();

    res.status(200).json({
      success: true,
      message: "Item removed from favorites",
      favorites
    });

  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing from favorites"
    });
  }
};

// Get user's favorites
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorites.findOne({ user: userId })
      .populate({
        path: 'items',
        select: 'title description price image categories type rating menuType'
      });

    if (!favorites) {
      return res.status(200).json({
        success: true,
        message: "No favorites found",
        favorites: { items: [] }
      });
    }

    res.status(200).json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting favorites"
    });
  }
};