

const Menu = require("../../models/staff/menu");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    // Check if we should filter by availability
    const filter = {};
    if (req.query.available === 'true') {
      filter.isAvailable = true;
    } else if (req.query.available === 'false') {
      filter.isAvailable = false;
    }
    
    const menuItems = await Menu.find(filter);
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};

// Get only available menu items
exports.getAvailableMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({ isAvailable: true });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available menu items", error });
  }
};

// Get a single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    // Transform the data to include a category field if needed
    const menuItemData = menuItem.toObject();
    
    // If categories exists but category doesn't, set category from categories
    if (menuItemData.categories && !menuItemData.category) {
      menuItemData.category = menuItemData.categories;
    }
    
    res.status(200).json(menuItemData);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Error fetching menu item", error: error.message });
  }
};


// Get today's special menu 
exports.getTodaysSpecialMenu = async (req, res) => {
  try {
    const specialMenus = await Menu.find({ menuType: "todays-special" });
    if (!specialMenus || specialMenus.length === 0) {
      return res.status(404).json({ success: true, message: "No today's special menu found" });
    }
    res.status(200).json({ success: true, data: specialMenus });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's special menu", error });
  }
};

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { title, price, type, menuType, categories, category, isAvailable } = req.body;
    const image = req.file;

    // Validate required fields
    if (!title || !price || !type || !menuType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get image path - this works with the diskStorage configuration
    const imagePath = `/uploads/${image.filename}`;

    // Handle categories properly to avoid the "[ undefined ]" error
    let categoryValue = '';
    
    // Use either categories or category field (to support both frontend implementations)
    if (category) {
      categoryValue = category;
    } else if (categories) {
      // If it's already a string, use it directly
      if (typeof categories === 'string') {
        categoryValue = categories;
      }
      // If it's an array with valid entries, join them
      else if (Array.isArray(categories) && categories.some(c => c !== undefined)) {
        categoryValue = categories.filter(c => c !== undefined).join(', ');
      }
    }

    const newMenuItem = new Menu({
      title,
      price,
      type,
      menuType,
      image: imagePath,
      categories: categoryValue, // Store in the 'categories' field in the database
      isAvailable: isAvailable !== undefined ? isAvailable : true, // Use provided value or default to true
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Error adding menu item", error: error.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { title, price, type, menuType, category, isAvailable } = req.body;
    
    const updateData = {
      title,
      price,
      type,
      menuType,
      // Store in both fields for compatibility
      categories: category,
      category
    };
    
    // Only update isAvailable if it was provided
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable;
    }
    
    // Handle image update if there's a new file
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Error updating menu item", error: error.message });
  }
};

// Toggle menu item availability
exports.toggleMenuAvailability = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    
    // Toggle the availability status
    menuItem.isAvailable = !menuItem.isAvailable;
    
    await menuItem.save();
    
    res.status(200).json({ 
      success: true, 
      message: `Menu item "${menuItem.title}" is now ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: menuItem.isAvailable 
    });
  } catch (error) {
    console.error("Error toggling menu availability:", error);
    res.status(500).json({ message: "Error toggling menu availability", error: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error });
  }
};