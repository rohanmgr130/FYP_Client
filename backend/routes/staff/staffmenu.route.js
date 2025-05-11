const express = require("express");
const router = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getTodaysSpecialMenu,
} = require("../../controllers/staff/menus");

// Use Memory Storage for file uploads
const upload = require('../../utils/multer.js');


// Get all menu items
router.get("/get-all-menu", getAllMenuItems);

// Get a single menu item by ID
router.get("/get-single-menu/:id", getMenuItemById);

// Add a new menu item
router.post("/add-menu-items", upload.single("image"), addMenuItem);

// Update a menu item
router.put("/update-menu/:id", upload.single("image"), updateMenuItem);

// Delete a menu item
router.delete("/delete-menu/:id", deleteMenuItem);

// Get today's special menu
router.get("/todays-special", getTodaysSpecialMenu);



module.exports = router;