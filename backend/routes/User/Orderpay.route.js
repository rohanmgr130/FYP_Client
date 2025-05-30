// routes/User/Orderpay.route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticateUser } = require("../../middleware/authMiddleware");

// Import controller
const orderController = require("../../controllers/User/Orderpay");

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
router.post("/create-order", upload.single("image"), orderController.createOrder);

// Private/protected routes
router.get("/get-all-orders", authenticateUser, orderController.getAllOrders);
router.get("/:id", authenticateUser, orderController.getOrderById);
router.post("/update-order/:id",  orderController.updateOrderStatus);
router.delete("/delete/:id", authenticateUser,  orderController.deleteOrder);
router.get("/my-orders/:userId", orderController.getMyOrders);

module.exports = router;

