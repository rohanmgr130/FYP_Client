const RewardMenu = require("../../models/staff/rewardsMenu");

// Get all reward items
exports.getAllRewardItems = async (req, res) => {
  try {
    // Check if we should filter by availability
    const filter = {};
    if (req.query.available === 'true') {
      filter.isAvailable = true;
    } else if (req.query.available === 'false') {
      filter.isAvailable = false;
    }
    
    const rewardItems = await RewardMenu.find(filter);
    res.status(200).json(rewardItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reward items", error });
  }
};

// Get only available reward items
exports.getAvailableRewardItems = async (req, res) => {
  try {
    const rewardItems = await RewardMenu.find({ isAvailable: true });
    res.status(200).json(rewardItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available reward items", error });
  }
};

// Get a single reward item by ID
exports.getRewardItemById = async (req, res) => {
  try {
    const rewardItem = await RewardMenu.findById(req.params.id);
    if (!rewardItem) {
      return res.status(404).json({ message: "Reward item not found" });
    }
    
    res.status(200).json(rewardItem);
  } catch (error) {
    console.error("Error fetching reward item:", error);
    res.status(500).json({ message: "Error fetching reward item", error: error.message });
  }
};

// Get reward items by type
exports.getRewardItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["vegetarian", "non-vegetarian", "drinks"];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be vegetarian, non-vegetarian, or drinks" });
    }
    
    const rewardItems = await RewardMenu.find({ type, isAvailable: true });
    res.status(200).json({ success: true, data: rewardItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reward items by type", error });
  }
};

// Get reward items by category
exports.getRewardItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const rewardItems = await RewardMenu.find({ 
      categories: { $regex: category, $options: 'i' }, 
      isAvailable: true 
    });
    res.status(200).json({ success: true, data: rewardItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reward items by category", error });
  }
};

// Add a new reward item
exports.addRewardItem = async (req, res) => {
  try {
    const { title, rewardPoints, type, categories, isAvailable } = req.body;
    const image = req.file;

    // Validate required fields
    if (!title || !rewardPoints || !type || !categories) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Validate type
    const validTypes = ["vegetarian", "non-vegetarian", "drinks"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be vegetarian, non-vegetarian, or drinks" });
    }

    // Validate reward points
    if (rewardPoints <= 0) {
      return res.status(400).json({ message: "Reward points must be greater than 0" });
    }

    // Get image path - this works with the diskStorage configuration
    const imagePath = `/uploads/${image.filename}`;

    const newRewardItem = new RewardMenu({
      title,
      rewardPoints: Number(rewardPoints),
      type,
      categories,
      image: imagePath,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    await newRewardItem.save();
    res.status(201).json(newRewardItem);
  } catch (error) {
    console.error("Error adding reward item:", error);
    res.status(500).json({ message: "Error adding reward item", error: error.message });
  }
};

// Update a reward item
exports.updateRewardItem = async (req, res) => {
  try {
    const { title, rewardPoints, type, categories, isAvailable } = req.body;
    
    const updateData = {};
    
    // Only update fields that are provided
    if (title) updateData.title = title;
    if (rewardPoints) {
      if (rewardPoints <= 0) {
        return res.status(400).json({ message: "Reward points must be greater than 0" });
      }
      updateData.rewardPoints = Number(rewardPoints);
    }
    if (type) {
      const validTypes = ["vegetarian", "non-vegetarian", "drinks"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid type. Must be vegetarian, non-vegetarian, or drinks" });
      }
      updateData.type = type;
    }
    if (categories) updateData.categories = categories;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    
    // Handle image update if there's a new file
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedRewardItem = await RewardMenu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedRewardItem) {
      return res.status(404).json({ message: "Reward item not found" });
    }
    
    res.status(200).json(updatedRewardItem);
  } catch (error) {
    console.error("Error updating reward item:", error);
    res.status(500).json({ message: "Error updating reward item", error: error.message });
  }
};

// Toggle reward item availability
exports.toggleRewardAvailability = async (req, res) => {
  try {
    const rewardItem = await RewardMenu.findById(req.params.id);
    
    if (!rewardItem) {
      return res.status(404).json({ message: "Reward item not found" });
    }
    
    // Toggle the availability status
    rewardItem.isAvailable = !rewardItem.isAvailable;
    
    await rewardItem.save();
    
    res.status(200).json({ 
      success: true, 
      message: `Reward item "${rewardItem.title}" is now ${rewardItem.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: rewardItem.isAvailable 
    });
  } catch (error) {
    console.error("Error toggling reward availability:", error);
    res.status(500).json({ message: "Error toggling reward availability", error: error.message });
  }
};

// Delete a reward item
exports.deleteRewardItem = async (req, res) => {
  try {
    const deletedRewardItem = await RewardMenu.findByIdAndDelete(req.params.id);
    if (!deletedRewardItem) {
      return res.status(404).json({ message: "Reward item not found" });
    }
    res.status(200).json({ message: "Reward item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reward item", error });
  }
};