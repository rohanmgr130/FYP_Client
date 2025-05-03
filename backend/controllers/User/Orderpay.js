// // const Orderpay = require("../../models/user/Orderpay");
// // const Cart = require("../../models/user/MyCart");
// // const mongoose = require("mongoose");

// // // Create a new order
// // exports.createOrder = async (req, res) => {
// //   try {
// //     const { cartId, orderMethod, additionalInfo } = req.body;


// //     // Validate cart exists and has not been already ordered
// //     if (!cartId) {
// //       return res.status(400).json({ success: false, message: "Cart ID is required" });
// //     }

// //     const cart = await Cart.findById(cartId);
// //     if (!cart) {
// //       return res.status(404).json({ success: false, message: "Cart not found" });
// //     }
    
// //     if (cart.isPlacedOrder) {
// //       return res.status(400).json({ success: false, message: "This cart has already been ordered" });
// //     }

// //     // Handle file upload
// //     let filePath = null;
// //     if (req.file) {
// //       filePath = req.file.path;
// //     }
    
// //     // Create order with cart data embedded
// //     const newOrder = new Orderpay({
// //       cartId,
// //       orderMethod,
// //       screenshot: filePath,
// //       additionalInfo,
// //       cartData: {
// //         userId: cart.userId,
// //         items: cart.items,
// //         orderTotal: cart.orderTotal,
// //         promoCode: cart.promoCode,
// //         discount: cart.discount,
// //         finalTotal: cart.finalTotal
// //       }
// //     });
    
// //     const savedOrder = await newOrder.save();

// //     // Delete the cart after order creation
// //     await Cart.findByIdAndDelete(cartId);
    
// //     res.status(201).json({
// //       success: true,
// //       message: "Order created successfully",
// //       order: savedOrder
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error creating order",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get all orders
// // exports.getAllOrders = async (req, res) => {
// //   try {
// //     // No need to populate cartId since we have cart data embedded
// //     const orders = await Orderpay.find();
    
// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching orders",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get order by ID
// // exports.getOrderById = async (req, res) => {
// //   try {
// //     // No need to populate cartId
// //     const order = await Orderpay.findById(req.params.id);
    
// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found"
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       order
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching order",
// //       error: error.message
// //     });
// //   }
// // };

// // // Update order status
// // exports.updateOrderStatus = async (req, res) => {
// //   try {
// //     const { orderStatus } = req.body;
    
// //     // Validate status
// //     const validStatuses = ["pending", "completed", "failed", "verified"];
// //     if (!validStatuses.includes(orderStatus)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid order status"
// //       });
// //     }
    
// //     const updatedOrder = await Orderpay.findByIdAndUpdate(
// //       req.params.id,
// //       { orderStatus },
// //       { new: true, runValidators: true }
// //     );
    
// //     if (!updatedOrder) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found"
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       message: "Order status updated successfully",
// //       order: updatedOrder
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error updating order status",
// //       error: error.message
// //     });
// //   }
// // };

// // // Upload payment screenshot
// // exports.uploadScreenshot = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please upload a screenshot"
// //       });
// //     }
    
// //     const updatedOrder = await Orderpay.findByIdAndUpdate(
// //       req.params.id,
// //       { screenshot: req.file.path },
// //       { new: true, runValidators: true }
// //     );
    
// //     if (!updatedOrder) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found"
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       message: "Screenshot uploaded successfully",
// //       order: updatedOrder
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error uploading screenshot",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get orders by cart ID
// // exports.getOrdersByCart = async (req, res) => {
// //   try {
// //     const { cartId } = req.params;
    
// //     // No need to populate since we have cart data embedded
// //     const orders = await Orderpay.find({ cartId });
    
// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching orders by cart",
// //       error: error.message
// //     });
// //   }
// // };

// // // Delete order (admin only)
// // exports.deleteOrder = async (req, res) => {
// //   try {
// //     const order = await Orderpay.findByIdAndDelete(req.params.id);
    
// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found"
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       message: "Order deleted successfully"
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error deleting order",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get orders for current user
// // exports.getMyOrders = async (req, res) => {
// //   try {
// //     const userId = req.user.id; // Assuming you have authentication middleware that adds user to req
    
// //     // Find orders where the embedded cart data has the user's ID
// //     const orders = await Orderpay.find({ "cartData.userId": mongoose.Types.ObjectId(userId) });
    
// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching your orders",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get orders for current user
// // exports.getMyOrders = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
    
// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User ID is required"
// //       });
// //     }
    
// //     // Correct way to use ObjectId - use mongoose model's native method
// //     const orders = await Orderpay.find({ "cartData.userId": userId })
// //       .sort({ createdAt: -1 });
    
// //     // Alternatively you can use:
// //     // const orders = await Orderpay.find({ "cartData.userId": new mongoose.Types.ObjectId(userId) })
    
// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders
// //     });
    
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching your orders",
// //       error: error.message
// //     });
// //   }
// // };


// const Orderpay = require("../../models/user/Orderpay");
// const Cart = require("../../models/user/MyCart");
// const mongoose = require("mongoose");

// // Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const { cartId, orderMethod, additionalInfo } = req.body;

//     // Validate cart exists and has not been already ordered
//     if (!cartId) {
//       return res.status(400).json({ success: false, message: "Cart ID is required" });
//     }

//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ success: false, message: "Cart not found" });
//     }
    
//     // Create order with cart data embedded
//     const newOrder = new Orderpay({
//       cartId,
//       orderMethod,
//       screenshot: req.file ? req.file.path : null,
//       additionalInfo,
//       cartData: {
//         userId: cart.userId,
//         items: cart.items,
//         orderTotal: cart.orderTotal,
//         promoCode: cart.promoCode,
//         discount: cart.discount,
//         finalTotal: cart.finalTotal
//       }
//     });
    
//     const savedOrder = await newOrder.save();

//     // Delete the cart after order creation
//     await Cart.findByIdAndDelete(cartId);
    
//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });
    
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating order",
//       error: error.message
//     });
//   }
// };

// // Get all orders
// exports.getAllOrders = async (req, res) => {
//   try {
//     // Fetch all orders with populated product details
//     const orders = await Orderpay.find()
//       .populate('cartData.items.productId')
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching orders",
//       error: error.message
//     });
//   }
// };

// // Get order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Orderpay.findById(req.params.id)
//       .populate('cartData.items.productId');
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       order
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching order",
//       error: error.message
//     });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
    
//     // Validate status
//     const validStatuses = ["pending", "completed", "failed", "verified"];
//     if (!validStatuses.includes(orderStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid order status"
//       });
//     }
    
//     const updatedOrder = await Orderpay.findByIdAndUpdate(
//       req.params.id,
//       { orderStatus },
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       order: updatedOrder
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating order status",
//       error: error.message
//     });
//   }
// };

// // Upload payment screenshot
// exports.uploadScreenshot = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a screenshot"
//       });
//     }
    
//     const updatedOrder = await Orderpay.findByIdAndUpdate(
//       req.params.id,
//       { screenshot: req.file.path },
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Screenshot uploaded successfully",
//       order: updatedOrder
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error uploading screenshot",
//       error: error.message
//     });
//   }
// };

// // Delete order (admin only)
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Orderpay.findByIdAndDelete(req.params.id);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully"
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting order",
//       error: error.message
//     });
//   }
// };

// // Get orders for specific user
// exports.getMyOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required"
//       });
//     }
    
//     // Find orders for this user
//     const orders = await Orderpay.find({ "cartData.userId": userId })
//       .populate('cartData.items.productId')
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching your orders",
//       error: error.message
//     });
//   }
// };


// const Orderpay = require("../../models/user/Orderpay");
// const Cart = require("../../models/user/MyCart");
// const mongoose = require("mongoose");

// // Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const { cartId, orderMethod, additionalInfo } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ success: false, message: "Cart ID is required" });
//     }

//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ success: false, message: "Cart not found" });
//     }

//     const newOrder = new Orderpay({
//       cartId,
//       orderMethod,
//       additionalInfo,
//       cartData: {
//         userId: cart.userId,
//         items: cart.items,
//         orderTotal: cart.orderTotal,
//         promoCode: cart.promoCode,
//         discount: cart.discount,
//         finalTotal: cart.finalTotal
//       }
//     });

//     const savedOrder = await newOrder.save();

//     await Cart.findByIdAndDelete(cartId);

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating order",
//       error: error.message
//     });
//   }
// };

// // Get all orders
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Orderpay.find()
//       .populate('cartData.items.productId')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching orders",
//       error: error.message
//     });
//   }
// };

// // Get order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Orderpay.findById(req.params.id)
//       .populate('cartData.items.productId');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching order",
//       error: error.message
//     });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderStatus } = req.body;

//     const validStatuses = ["pending", "completed", "failed", "verified"];
//     if (!validStatuses.includes(orderStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid order status"
//       });
//     }

//     const updatedOrder = await Orderpay.findByIdAndUpdate(
//       req.params.id,
//       { orderStatus },
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       order: updatedOrder
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating order status",
//       error: error.message
//     });
//   }
// };

// // Delete order (admin only)
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Orderpay.findByIdAndDelete(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting order",
//       error: error.message
//     });
//   }
// };

// // Get orders for specific user
// exports.getMyOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required"
//       });
//     }

//     const orders = await Orderpay.find({ "cartData.userId": userId })
//       .populate('cartData.items.productId')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching your orders",
//       error: error.message
//     });
//   }
// };



// controllers/User/Orderpay.js
const Orderpay = require("../../models/user/Orderpay");
const Cart = require("../../models/user/MyCart");
const mongoose = require("mongoose");
const { finalizePromoCode } = require("../../controllers/User/MyCart");
const PromoCode = require('../../models/admin/promocode');

// Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const { cartId, orderMethod, additionalInfo } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ success: false, message: "Cart ID is required" });
//     }

//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ success: false, message: "Cart not found" });
//     }

//     if (cart.promoCode) {
//       await finalizePromoCode(cart.userId, cart.promoCode);
//     }

//     // Create new order with screenshot if provided
//     const newOrder = new Orderpay({
//       cartId,
//       orderMethod,
//       screenshot: req.file ? req.file.path : null,
//       additionalInfo,
//       cartData: {
//         userId: cart.userId,
//         items: cart.items,
//         orderTotal: cart.orderTotal,
//         promoCode: cart.promoCode,
//         discount: cart.discount,
//         finalTotal: cart.finalTotal
//       }
//     });

//     const savedOrder = await newOrder.save();

//     // If a promo code was used, mark it as used
//     // Note: This is redundant as we're already calling finalizePromoCode above
//     // You can remove this second call if desired
//     if (cart.promoCode) {
//       await finalizePromoCode(cart.userId, cart.promoCode);
//     }

//     // Delete the cart after order creation
//     await Cart.find
//     ByIdAndDelete(cartId);

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating order",
//       error: error.message
//     });
//   }
// };

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

    // Optional: finalizePromoCode again (redundant if already done above)
    // if (cart.promoCode) {
    //   await finalizePromoCode(cart.userId, cart.promoCode);
    // }

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

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Orderpay.findById(req.params.id)
      .populate('cartData.items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ["pending", "completed", "failed", "verified"];
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
