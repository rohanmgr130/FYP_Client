const Menu = require("../../models/staff/menu");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};

// Get a single menu item by ID
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

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { title, price, type, categories } = req.body;
    if (!title || !price || !type || !categories) {
      return res.status(400).json({ message: `All fields are required  ` });
    }

    const newMenuItem = new Menu({
      title,
      price,
      type,
      categories: categories.map((cat) => cat.toLowerCase()),
      // image,
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { title, price, type, categories, image } = req.body;
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        type,
        categories: categories.map((cat) => cat.toLowerCase()),
        image,
      },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
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
