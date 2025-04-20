const OrderHistory = require("../../models/user/Ordershistory");
const Orderpay = require("../../models/user/Orderpay");

// Get all order histories
exports.getAllOrderHistories = async (req, res) => {
  try {
    const histories = await OrderHistory.find().populate("userId orders");

    res.status(200).json({
      success: true,
      count: histories.length,
      histories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order histories",
      error: error.message,
    });
  }
};

// Get order history by user ID
exports.getOrderHistoryByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await OrderHistory.findOne({ userId }).populate("orders");

    // Changed from 404 to 200 with empty data structure
    if (!history) {
      return res.status(200).json({
        success: true,
        message: "No order history found for this user",
        history: { userId, orders: [], totalAmount: 0 }
      });
    }

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error in getOrderHistoryByUserId:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order history",
      error: error.message,
    });
  }
};

// Add order to user history
exports.addOrderToHistory = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // Validate input
    if (!userId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "userId and orderId are required",
      });
    }

    const order = await Orderpay.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let history = await OrderHistory.findOne({ userId });

    if (!history) {
      // Create a new history entry if none exists
      history = new OrderHistory({
        userId,
        orders: [orderId],
        totalAmount: order.additionalInfo?.totalAmount || 0,
      });
    } else {
      // Update existing history
      if (!history.orders.includes(orderId)) {
        history.orders.push(orderId);
        history.totalAmount += order.additionalInfo?.totalAmount || 0;
      } else {
        return res.status(400).json({
          success: false,
          message: "Order already exists in user history",
        });
      }
    }

    await history.save();

    res.status(201).json({
      success: true,
      message: "Order added to history successfully",
      history,
    });
  } catch (error) {
    console.error("Error in addOrderToHistory:", error);
    res.status(500).json({
      success: false,
      message: "Error adding order to history",
      error: error.message,
    });
  }
};

// Delete an order from history - original method (expecting DELETE request)
exports.deleteOrderFromHistory = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    if (!userId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "userId and orderId are required",
      });
    }
    
    const history = await OrderHistory.findOne({ userId });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Order history not found for this user",
      });
    }

    // Check if the order exists in the history
    if (!history.orders.includes(orderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found in user history",
      });
    }

    history.orders = history.orders.filter(
      (order) => order.toString() !== orderId
    );

    // Recalculate the total amount if needed
    const order = await Orderpay.findById(orderId);
    if (order && order.additionalInfo?.totalAmount) {
      history.totalAmount -= order.additionalInfo.totalAmount;
      // Ensure totalAmount doesn't go below 0 due to calculations
      if (history.totalAmount < 0) history.totalAmount = 0;
    }

    await history.save();

    res.status(200).json({
      success: true,
      message: "Order removed from history successfully",
      history,
    });
  } catch (error) {
    console.error("Error in deleteOrderFromHistory:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting order from history",
      error: error.message,
    });
  }
};

// New method for handling POST requests to delete (to match the frontend change)
exports.deleteOrderFromHistoryPost = async (req, res) => {
  // This is the same implementation as deleteOrderFromHistory
  // but it's set up to handle POST requests
  return exports.deleteOrderFromHistory(req, res);
};