
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
const { createPromoCode, getValidPromoCodes, redeemPromoCode, getUserRedeemedPromos } = require("../../controllers/staff/promocode.js");

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


//promocode routes
router.post("/create-promo", createPromoCode)
router.get("/get-all-promo", getValidPromoCodes)
router.post("/reedem-promo/:userId", redeemPromoCode) //for reedeming available promo
router.get("/get-my-promo/:userId",getUserRedeemedPromos)

module.exports = router;