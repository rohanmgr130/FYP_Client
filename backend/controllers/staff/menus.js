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

//get todays special menu 
exports.getTodaysSpecialMenu = async (req, res) => {
  const specialMenus = await Menu.find({menuType:"todays-special"})
  if(!specialMenus || specialMenus.length === 0){
    return res.status(404).json({successL:true, message: "No todays special menu found" });
  }
  res.status(200).json({success:true, data:specialMenus});
}

// Add a new menu item
// exports.addMenuItem = async (req, res) => {
//   try {
//     const { title, price, type, categories } = req.body;
//     const image = req.file;

//     // Validate required fields
//     if (!title || !price || !type || !categories) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!image) {
//       return res.status(400).json({ message: "Image is required" });
//     }

//     // Get image path
//     const imagePath = `/uploads/${image.filename}`;

//     // Ensure categories is an array
//     const categoryArray = Array.isArray(categories) ? categories : categories.split(",").map(cat => cat.trim().toLowerCase());

//     const newMenuItem = new Menu({
//       title,
//       price,
//       type,
//       image: imagePath,
//       categories: categoryArray,
//     });

//     await newMenuItem.save();
//     res.status(201).json(newMenuItem);
//   } catch (error) {
//     res.status(500).json({ message: "Error adding menu item", error });
//   }
// };
// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const { title, price, type, menuType, categories } = req.body;
    const image = req.file;

    console.log("image", image)

    // Validate required fields
    if (!title || !price || !type || !menuType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get image path - this works with the diskStorage configuration
    const imagePath = `/uploads/${image.filename}`;

    // Ensure categories is an array
    const categoryArray = Array.isArray(categories) ? categories : [categories].flat();

    const newMenuItem = new Menu({
      title,
      price,
      type,
      menuType, // Added this field
      image: imagePath, // Store the path to the image
      categories: categoryArray,
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
    const { title, price, type, categories } = req.body;
    const image = req.file;

    const updateData = {
      title,
      price,
      type,
      categories: Array.isArray(categories) ? categories : categories.split(",").map(cat => cat.trim().toLowerCase()),
    };

    // If an image is uploaded, update it
    if (image) {
      updateData.image = `/uploads/${image.filename}`;
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });

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
