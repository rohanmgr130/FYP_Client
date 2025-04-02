const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  createOrder,
  deleteOrder,
} = require("../../controllers/User/Orderhistory");

// Route to get all orders
router.get("/", getAllOrders);

// Route to create a new order
router.post("/", createOrder);

// Route to delete an order
router.delete("/:id", deleteOrder);

module.exports = router;
