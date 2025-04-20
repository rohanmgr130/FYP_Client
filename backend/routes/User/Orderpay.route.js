const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticateUser, isAdmin } = require("../../middleware/authMiddleware");

// Import controller
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  uploadScreenshot,
  getOrdersByCart,
  deleteOrder
} = require("../../controllers/User/Orderpay");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes with authentication
router.post("/create-order",  upload.single("image"), createOrder); 
// router.get("/cart/:cartId", getOrdersByCart);

// Private/protected routes
router.get("/get-all-orders", getAllOrders);
router.get("/:id", authenticateUser, getOrderById);
router.patch("/:id/status", authenticateUser, updateOrderStatus);
router.patch("/:id/screenshot", authenticateUser, upload.single("image"), uploadScreenshot);
router.delete("/:id", authenticateUser, isAdmin, deleteOrder);

module.exports = router;