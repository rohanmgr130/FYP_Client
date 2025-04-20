const express = require("express");
const OrderHistoryRouter = express.Router();
const {
  getAllOrderHistories,
  getOrderHistoryByUserId,
  addOrderToHistory,
  deleteOrderFromHistory
} = require("../../controllers/User/Orderhistory");

// Route to get all order histories
OrderHistoryRouter.get("/", getAllOrderHistories);

// Route to get order history by user ID
OrderHistoryRouter.get("/user/:userId", getOrderHistoryByUserId);

// Route to add order to history
OrderHistoryRouter.post("/", addOrderToHistory);

// Route to delete an order from history (original DELETE method)
OrderHistoryRouter.delete("/", deleteOrderFromHistory);

// New route for POST delete - to match the frontend change
OrderHistoryRouter.post("/delete", deleteOrderFromHistory);

module.exports = OrderHistoryRouter;