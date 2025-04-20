const Orderpay = require("../../models/user/Orderpay")
const Cart = require("../../models/user/MyCart");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    
    const { cartId, orderMethod, paymentImage ,additionalInfo } = req.body;
    console.log(req.body)
    // Validate cart exists

    const cart = await Cart.findById(cartId);
    console.log('cart data', cart);
    if (!cartId) {
      return res.status(400).json({ success: false, message: "Cart ID is required" });
    }
    

    let filePath
    // Save screenshot if provided
    if (req.file) {
      filePath= req.file.path;
    }
    
    const savedOrder = await Orderpay.create({
      cartId,
      orderMethod,
      screenshot: filePath ? filePath : null, 
      additionalInfo,
    })

    await Cart.findByIdAndUpdate(
      cartId,
      { $set: { "items.$[].isPlacedOrder": true } },
      { new: true }
    );
        
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder
    });
    
  } catch (error) {
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
    const orders = await Orderpay.find().populate('cartId');
    
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
  console.log("first")
  try {
    const order = await Orderpay.findById(req.params.id).populate('cartId');

    
    
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
    
    // Validate status
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

// Upload payment screenshot
exports.uploadScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a screenshot"
      });
    }
    
    const updatedOrder = await Orderpay.findByIdAndUpdate(
      req.params.id,
      { screenshot: req.file.path },
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
      message: "Screenshot uploaded successfully",
      order: updatedOrder
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading screenshot",
      error: error.message
    });
  }
};

// Get orders by user (assuming cartId is linked to a user)
exports.getOrdersByCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    
    const orders = await Orderpay.find({ cartId }).populate('cartId');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders by cart",
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


//for user orders
exports.getMyOrders = async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}