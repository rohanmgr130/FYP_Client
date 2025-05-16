
// const Orderpay = require("../../models/user/Orderpay");
// const User = require("../../models/user/User");
// const Cart = require("../../models/user/MyCart");
// const { finalizePromoCode } = require("../../controllers/User/MyCart");

// /**
//  * Initiates a Khalti payment for an order
//  */
// const khalti = async (req, res) => {
//   try {
//     const { orderId, cartId } = req.body;

//     // Check if we have either orderId or cartId
//     if (!orderId && !cartId) {
//       return res.status(400).json({ error: "Either Order ID or Cart ID is required" });
//     }

//     let order;
    
//     // If we have cartId but no orderId, create a new order first
//     if (cartId && !orderId) {
//       const cart = await Cart.findById(cartId)
//         .populate({
//           path: 'items.productId',
//           model: 'Menu',
//           select: 'name price description image'
//         });
      
//       if (!cart) {
//         return res.status(404).json({ error: "Cart not found" });
//       }
      
//       // If a promo code is applied, finalize it
//       if (cart.promoCode) {
//         await finalizePromoCode(cart.userId, cart.promoCode);
//       }
      
//       // Create new order
//       const newOrder = new Orderpay({
//         cartId,
//         orderMethod: "khalti", // Set method to khalti
//         cartData: {
//           userId: cart.userId,
//           items: cart.items,
//           orderTotal: cart.orderTotal || 
//             cart.items.reduce((sum, item) => sum + item.total, 0),
//           promoCode: cart.promoCode,
//           discount: cart.discount || 0,
//           finalTotal: cart.finalTotal || 
//             (cart.orderTotal || cart.items.reduce((sum, item) => sum + item.total, 0)) - 
//             (cart.discount || 0)
//         }
//       });
      
//       order = await newOrder.save();
//     } else {
//       // Find existing order by ID and populate necessary fields
//       order = await Orderpay.findById(orderId)
//         .populate({
//           path: 'cartData.userId',
//           model: 'User',
//           select: 'fullname email phone'
//         });
//     }

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     if (!order.cartData || !order.cartData.finalTotal) {
//       return res.status(400).json({ error: "Order data is incomplete" });
//     }

//     // Ensure we have the correct final total
//     const finalTotal = order.cartData.finalTotal;
//     if (!finalTotal || finalTotal <= 0) {
//       return res.status(400).json({ error: "Invalid order amount" });
//     }

//     // Get user information from the populated order or fetch if needed
//     let user;
//     if (order.cartData.userId && typeof order.cartData.userId === 'object') {
//       user = order.cartData.userId;
//     } else if (order.cartData.userId) {
//       user = await User.findById(order.cartData.userId).select('fullname email phone');
//     }
    
//     // Create Khalti payment configuration
//     const khaltiConfig = {
//       return_url: `${process.env.NEXT_BASE_URL}/order-success/${order._id}`,
//       website_url: process.env.NEXT_BASE_URL,
//       amount: Math.round(finalTotal * 100), // Convert to paisa and ensure it's a whole number
//       purchase_order_id: order._id.toString(),
//       purchase_order_name: `Food Order #${order._id.toString().slice(-6)}`,
//       customer_info: {
//         name: user?.fullname || "Rohan Thapa Magar",
//         email: user?.email || "rohanmgr130gmail.com",
//         phone: user?.phone?.toString() || "",
//       },
//     };

//     // Validate Khalti secret key
//     if (!process.env.KHALTI_SECRET_KEY) {
//       return res.status(500).json({ error: "Khalti secret key is missing" });
//     }

//     // Send request to Khalti API
//     const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
//       method: "POST",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(khaltiConfig),
//     });

//     const khaltiResponse = await response.json();

//     if (!response.ok) {
//       console.error("Khalti API Error:", khaltiResponse);
//       return res.status(400).json({ error: "Payment initiation failed", details: khaltiResponse });
//     }

//     // Update order with Khalti payment information
//     order.khaltiPayment = {
//       pidx: khaltiResponse.pidx,
//       paymentUrl: khaltiResponse.payment_url,
//       status: "initiated",
//       amount: finalTotal
//     };
    
//     order.orderMethod = "khalti";
//     await order.save();

//     // If we created the order from a cart, delete the cart
//     if (cartId && !orderId) {
//       await Cart.findByIdAndDelete(cartId);
//     }

//     // Send successful response
//     res.status(200).json({
//       success: true,
//       orderId: order._id,
//       khaltiPaymentUrl: khaltiResponse.payment_url,
//       transactionId: khaltiResponse.pidx,
//       amount: finalTotal
//     });

//   } catch (error) {
//     console.error("Payment API Error:", error);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// /**
//  * Verifies a Khalti payment after user returns from payment page
//  */
// const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, orderId } = req.body;

//     if (!pidx || !orderId) {
//       return res.status(400).json({ error: "Transaction ID and Order ID are required" });
//     }

//     // Find the order
//     const order = await Orderpay.findById(orderId)
//       .populate({
//         path: 'cartData.items.productId',
//         model: 'Menu',
//         select: 'name price description image'
//       });
      
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Check if the pidx matches
//     if (order.khaltiPayment?.pidx !== pidx) {
//       return res.status(400).json({ error: "Transaction ID does not match order records" });
//     }

//     // Verify payment with Khalti
//     const response = await fetch(`https://a.khalti.com/api/v2/epayment/lookup/${pidx}/`, {
//       method: "GET",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//       },
//     });

//     const verificationData = await response.json();

//     if (!response.ok) {
//       console.error("Khalti Verification Error:", verificationData);
//       return res.status(400).json({ error: "Payment verification failed", details: verificationData });
//     }

//     // Update order status based on Khalti verification
//     if (verificationData.status === "Completed") {
//       order.orderStatus = "Verified";
//       order.khaltiPayment.status = "completed";
      
//       // Add reward points when payment is verified
//       try {
//         // Get the total price of the order
//         const orderTotal = order.cartData.finalTotal;
        
//         // Get the userId from the order details
//         const userId = order.cartData.userId;
        
//         if (orderTotal && userId) {
//           // Calculate the reward points based on tiered structure
//           let pointsPercentage;
          
//           if (orderTotal <= 300) {
//             pointsPercentage = 2; // 2% for orders up to Rs 300
//           } else if (orderTotal <= 700) {
//             pointsPercentage = 4; // 4% for orders Rs 301-700
//           } else {
//             pointsPercentage = 5; // 5% for orders above Rs 700
//           }
          
//           // Calculate actual points based on the percentage of the order total
//           const pointsToAdd = Math.round((pointsPercentage / 100) * orderTotal);
          
//           // Find user from userId
//           const user = await User.findById(userId);
          
//           if (user) {
//             // Update the user reward points by adding the calculated points
//             user.rewardPoints = (user.rewardPoints || 0) + pointsToAdd;
//             await user.save();
            
//             console.log(`Added ${pointsToAdd} reward points (${pointsPercentage}% of Rs ${orderTotal}) to user ${userId} for order ${order._id}`);
//           }
//         }
//       } catch (rewardError) {
//         // Log error but don't fail the order status update
//         console.error("Error updating reward points:", rewardError);
//       }
      
//       await order.save();

//       return res.status(200).json({ 
//         success: true, 
//         message: "Payment verified successfully",
//         order: order
//       });
//     } else {
//       order.orderStatus = "Cancelled";
//       order.khaltiPayment.status = "failed";
//       await order.save();

//       return res.status(400).json({ 
//         success: false, 
//         message: "Payment was not completed",
//         status: verificationData.status
//       });
//     }

//   } catch (error) {
//     console.error("Payment Verification Error:", error);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

// module.exports = { khalti, verifyKhaltiPayment };








const Orderpay = require("../../models/user/Orderpay");
const User = require("../../models/user/User");
const Cart = require("../../models/user/MyCart");
const { finalizePromoCode } = require("../../controllers/User/MyCart");

/**
 * Initiates a Khalti payment for an order
 */
const khalti = async (req, res) => {
  try {
    const { orderId, cartId, userId, amount } = req.body;

    // Check if we have either orderId or cartId
    if (!orderId && !cartId) {
      return res.status(400).json({ error: "Either Order ID or Cart ID is required" });
    }

    let order;
    
    // If we have cartId but no orderId, create a new order first
    if (cartId && !orderId) {
      const cart = await Cart.findById(cartId)
        .populate({
          path: 'items.productId',
          model: 'Menu',
          select: 'name price description image'
        });
      
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      // If a promo code is applied, finalize it
      if (cart.promoCode) {
        await finalizePromoCode(cart.userId || userId, cart.promoCode);
      }
      
      // Create new order
      const newOrder = new Orderpay({
        cartId,
        orderMethod: "khalti", // Set method to khalti
        cartData: {
          userId: cart.userId || userId,
          items: cart.items,
          orderTotal: cart.orderTotal || 
            cart.items.reduce((sum, item) => sum + item.total, 0),
          promoCode: cart.promoCode,
          discount: cart.discount || 0,
          finalTotal: cart.finalTotal || 
            (cart.orderTotal || cart.items.reduce((sum, item) => sum + item.total, 0)) - 
            (cart.discount || 0)
        }
      });
      
      order = await newOrder.save();
    } else {
      // Find existing order by ID and populate necessary fields
      order = await Orderpay.findById(orderId)
        .populate({
          path: 'cartData.userId',
          model: 'User',
          select: 'fullname email phone'
        });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found or could not be created" });
    }

    if (!order.cartData || !order.cartData.finalTotal) {
      return res.status(400).json({ error: "Order data is incomplete" });
    }

    // Ensure we have the correct final total, using amount parameter if provided
    const finalTotal = amount || order.cartData.finalTotal;
    if (!finalTotal || finalTotal <= 0) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    // Get user information from the populated order or fetch if needed
    let user;
    if (order.cartData.userId && typeof order.cartData.userId === 'object') {
      user = order.cartData.userId;
    } else if (order.cartData.userId) {
      user = await User.findById(order.cartData.userId).select('fullname email phone');
    } else if (userId) {
      user = await User.findById(userId).select('fullname email phone');
    }

        console.log('process', process);
    console.log('process.env', process.env);

    console.log('processurl', process.env.NEXT_BASE_URL);

    
    // Create Khalti payment configuration
    const khaltiConfig = {
      return_url: `${process.env.NEXT_BASE_URL}`,
      website_url: process.env.NEXT_BASE_URL,
      amount: Math.round(finalTotal * 100), // Convert to paisa and ensure it's a whole number
      purchase_order_id: order._id.toString(),
      purchase_order_name: `Food Order #${order._id.toString().slice(-6)}`,
      customer_info: {
        name: user?.fullname || "Rohan Thapa Magar",
        email: user?.email || "rohanmgr130@gmail.com",
        phone: user?.phone?.toString() || "",
      },
    };

    // Validate Khalti secret key
    if (!process.env.KHALTI_SECRET_KEY) {
      return res.status(500).json({ error: "Khalti secret key is missing" });
    }

    // Send request to Khalti API
    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khaltiConfig),
    });

    const khaltiResponse = await response.json();

    if (!response.ok) {
      console.error("Khalti API Error:", khaltiResponse);
      return res.status(400).json({ error: "Payment initiation failed", details: khaltiResponse });
    }

    // Update order with Khalti payment information
    order.khaltiPayment = {
      pidx: khaltiResponse.pidx,
      paymentUrl: khaltiResponse.payment_url,
      status: "initiated",
      amount: finalTotal
    };
    
    order.orderMethod = "khalti";
    await order.save();
    // Delete the cart after order creation
    await Cart.findByIdAndDelete(cartId);

    // Send successful response
    res.status(200).json({
      success: true,
      orderId: order._id,
      khaltiPaymentUrl: khaltiResponse.payment_url,
      transactionId: khaltiResponse.pidx,
      amount: finalTotal
    });

  } catch (error) {
    console.error("Payment API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

/**
 * Verifies a Khalti payment after user returns from payment page
 */
const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body;

    if (!pidx || !orderId) {
      return res.status(400).json({ error: "Transaction ID and Order ID are required" });
    }

    // Find the order
    const order = await Orderpay.findById(orderId)
      .populate({
        path: 'cartData.items.productId',
        model: 'Menu',
        select: 'name price description image'
      });
      
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the pidx matches
    if (order.khaltiPayment?.pidx !== pidx) {
      return res.status(400).json({ error: "Transaction ID does not match order records" });
    }

    // Verify payment with Khalti
    const response = await fetch(`https://a.khalti.com/api/v2/epayment/lookup/${pidx}/`, {
      method: "GET",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    });

    const verificationData = await response.json();

    if (!response.ok) {
      console.error("Khalti Verification Error:", verificationData);
      return res.status(400).json({ error: "Payment verification failed", details: verificationData });
    }

    // Update order status based on Khalti verification
    if (verificationData.status === "Completed") {
      order.orderStatus = "Verified";
      order.khaltiPayment.status = "completed";
      
      // Add reward points when payment is verified
      try {
        // Get the total price of the order
        const orderTotal = order.cartData.finalTotal;
        
        // Get the userId from the order details
        const userId = order.cartData.userId;
        
        if (orderTotal && userId) {
          // Calculate the reward points based on tiered structure
          let pointsPercentage;
          
          if (orderTotal <= 300) {
            pointsPercentage = 2; // 2% for orders up to Rs 300
          } else if (orderTotal <= 700) {
            pointsPercentage = 4; // 4% for orders Rs 301-700
          } else {
            pointsPercentage = 5; // 5% for orders above Rs 700
          }
          
          // Calculate actual points based on the percentage of the order total
          const pointsToAdd = Math.round((pointsPercentage / 100) * orderTotal);
          
          // Find user from userId
          const user = await User.findById(userId);
          
          if (user) {
            // Update the user reward points by adding the calculated points
            user.rewardPoints = (user.rewardPoints || 0) + pointsToAdd;
            await user.save();
            
            console.log(`Added ${pointsToAdd} reward points (${pointsPercentage}% of Rs ${orderTotal}) to user ${userId} for order ${order._id}`);
          }
        }
      } catch (rewardError) {
        // Log error but don't fail the order status update
        console.error("Error updating reward points:", rewardError);
      }
      
      await order.save();

      return res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully",
        order: order
      });
    } else {
      order.orderStatus = "Cancelled";
      order.khaltiPayment.status = "failed";
      await order.save();

      return res.status(400).json({ 
        success: false, 
        message: "Payment was not completed",
        status: verificationData.status
      });
    }

  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { khalti, verifyKhaltiPayment };