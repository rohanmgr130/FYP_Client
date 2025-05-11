// controllers/User/Orderpay.js
const Orderpay = require("../../models/user/Orderpay");
const Cart = require("../../models/user/MyCart");
const mongoose = require("mongoose");
const { finalizePromoCode } = require("../../controllers/User/MyCart");
const PromoCode = require('../../models/admin/promocode');
const User = require('../../models/user/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { cartId, orderMethod, additionalInfo } = req.body;

    if (!cartId) {
      return res.status(400).json({ success: false, message: "Cart ID is required" });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // If a promo code is applied, finalize it
    if (cart.promoCode) {
      await finalizePromoCode(cart.userId, cart.promoCode);
    }

    // Create new order with screenshot if provided
    const newOrder = new Orderpay({
      cartId,
      orderMethod,
      screenshot: req.file ? req.file.path : null,
      additionalInfo,
      cartData: {
        userId: cart.userId,
        items: cart.items,
        orderTotal: cart.orderTotal,
        promoCode: cart.promoCode,
        discount: cart.discount,
        finalTotal: cart.finalTotal
      }
    });

    const savedOrder = await newOrder.save();

    // Delete the cart after order creation
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orderpay.find()
      .populate('cartData.items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};



exports.getOrderById = async (req, res) => {
  try {
    // Use deep population to ensure the product details are fully populated
    const order = await Orderpay.findById(req.params.id)
      .populate({
        path: 'cartData.items.productId',
        model: 'Menu',
        select: 'name price description image' // Select the fields you need
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // If the items don't have a name, try to add a fallback
    if (order.cartData && order.cartData.items) {
      order.cartData.items = order.cartData.items.map(item => {
        // If productId is not populated or doesn't have a name, add a default name
        if (!item.productId || typeof item.productId !== 'object') {
          item.productName = item.productName || "Product Item";
        }
        return item;
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    console.log('orderStatus', orderStatus);

    const validStatuses = ["Pending", "Completed", "Cancelled", "Verified", "Preparing"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const updatedOrder = await Orderpay.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    console.log('orderStatus', orderStatus);

    // Add reward points when order is marked as completed or verified
    if (orderStatus === "Completed") {
      try {
        console.log('updatedOrder', updatedOrder);
        // Get the total price of the order
        const orderTotal = updatedOrder.cartData.finalTotal;
        
        // Get the userId from the order details
        const userId = updatedOrder.cartData.userId;
        
        if (orderTotal && userId) {
          // Calculate the reward points based on tiered structure
          let myPoints;
          
          if (orderTotal <= 300) {
            myPoints = 2; 
          } else if (orderTotal <= 700) {
            myPoints = 4; 
          } else {
            myPoints = 5; 
          }
          
          // Calculate actual points based on the percentage of the order total
          const pointsToAdd = myPoints;
          
          // Find user from userId
          const user = await User.findById(userId);
          
          if (user) {
            // Update the user reward points by adding the calculated points
            user.rewardPoints = (user.rewardPoints || 0) + pointsToAdd;
            await user.save();
            
            console.log(`Added ${pointsToAdd} reward points (${pointsPercentage}% of Rs ${orderTotal}) to user ${userId} for order ${updatedOrder._id}`);
          }
        }
      } catch (rewardError) {
        // Log error but don't fail the order status update
        console.error("Error updating reward points:", rewardError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Delete order (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Orderpay.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message
    });
  }
};

// Get orders for specific user
exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const orders = await Orderpay.find({ "cartData.userId": userId })
      .populate('cartData.items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your orders",
      error: error.message
    });
  }
};