// const express = require("express");
// const router = express.Router();

// const {
//   getAllMenuItems,
//   getMenuItemById,
//   addMenuItem,
//   updateMenuItem,
//   deleteMenuItem,
//   getTodaysSpecialMenu,
// } = require("../../controllers/staff/menus");

// // Use Memory Storage for file uploads
// const upload = require('../../utils/multer.js');


// // Get all menu items
// router.get("/get-all-menu", getAllMenuItems);

// // Get a single menu item by ID
// router.get("/get-single-menu/:id", getMenuItemById);

// // Add a new menu item
// router.post("/add-menu-items", upload.single("image"), addMenuItem);

// // Update a menu item
// router.put("/update-menu/:id", upload.single("image"), updateMenuItem);

// // Delete a menu item
// router.delete("/delete-menu/:id", deleteMenuItem);

// // Get today's special menu
// router.get("/todays-special", getTodaysSpecialMenu);



// module.exports = router;



const express = require("express");
const router = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getTodaysSpecialMenu,
  getAvailableMenuItems,
  toggleMenuAvailability,
} = require("../../controllers/staff/menus");

// Use Memory Storage for file uploads
const upload = require('../../utils/multer.js');

// Get all menu items (can filter with ?available=true or ?available=false)
router.get("/get-all-menu", getAllMenuItems);

// Get only available menu items
router.get("/available-menu", getAvailableMenuItems);

// Get a single menu item by ID
router.get("/get-single-menu/:id", getMenuItemById);

// Add a new menu item
router.post("/add-menu-items", upload.single("image"), addMenuItem);

// Update a menu item
router.put("/update-menu/:id", upload.single("image"), updateMenuItem);

// Toggle menu item availability
router.patch("/toggle-availability/:id", toggleMenuAvailability);

// Delete a menu item
router.delete("/delete-menu/:id", deleteMenuItem);

// Get today's special menu
router.get("/todays-special", getTodaysSpecialMenu);

module.exports = router;