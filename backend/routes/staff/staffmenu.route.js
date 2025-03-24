const express = require("express");
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../../controllers/staff/menus");

// Get all menu items
router.get("/get-all-menu", getAllMenuItems);

// Get a single menu item by ID
router.get("/get-single-menu/:id", getMenuItemById);

// Add a new menu item
router.post("/add-menu-items", addMenuItem);

// Update a menu item
router.put("/update-menu/:id", updateMenuItem);

// Delete a menu item
router.delete("/delete-menu/:id", deleteMenuItem);

module.exports = router;
