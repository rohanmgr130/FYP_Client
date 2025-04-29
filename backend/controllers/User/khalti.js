// const Orderpay = require("../../models/user/Orderpay");

// const khalti = async (req, res) => {
//     try {
//       const { orderId } = req.body;

//       console.log(orderId)
  
//       // const order = await Order.findById(orderId).populate("clientId");
//        // Fetch order details from DB & explicitly define populated type
//        const order = await Orderpay.findById(orderId).populate("cartData");
  
//       if (!order) {
//         res.status(404).json({ error: "Order not found" });
//         return;
//       }
  
//       if (!order.cartData) {
//         res.status(404).json({ success: false, message: "User not found" });
//         return;
//       }
  
//       // Khalti payment payload
//       const khaltiConfig = {
//         return_url: `${process.env.NEXT_BASE_URL}/order-success`,
//         website_url: process.env.NEXT_BASE_URL,
//         amount: 1000 * 100, // Convert to paisa
//         purchase_order_id: "6808badf626b41196225c5fd",
//         purchase_order_name: order.cartData.fullname ||"Rohan",
//         customer_info: {
//           name: "rohan" || "Unknown Customer", // Fetch name from clientId
//           email: "rohan@gmail.com"|| "customer@email.com",
//         //   phone: order. .toString(),
//         },
//       };
      
  
  
  
//       if (!process.env.KHALTI_SECRET_KEY) {
//         res.status(500).json({ success: false, message: "Khalti secret key is missing" });
//         return;
//       }
  
//       const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
//         method: "POST",
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(khaltiConfig),
//       });
  
//       const khaltiResponse = await response.json();
  
//       if (!response.ok) {
//         console.error("Khalti API Error:", khaltiResponse);
//         res.status(400).json({ error: "Payment initiation failed", details: khaltiResponse });
//         return;
//       }
  
//     //   order.paymentMethod = "Khalti"
//     //   await order.save()
  
//       res.status(200).json({
//         khaltiPaymentUrl: khaltiResponse.payment_url,
//         transactionId: khaltiResponse.pidx,
//       });
  
//     } catch (error) {
//       console.error("Payment API Error:", error);
//       if (error instanceof Error) {
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//       }
//     }
//   };

//   module.exports = {khalti}

const Orderpay = require("../../models/user/Orderpay");

const khalti = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order by ID
    const order = await Orderpay.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.cartData) {
      return res.status(404).json({ success: false, message: "Cart data missing" });
    }

    // Payment configuration for Khalti
    const khaltiConfig = {
      return_url: `${process.env.NEXT_BASE_URL}/order-success`,
      website_url: process.env.NEXT_BASE_URL,
      amount: order.cartData.finalTotal * 100, // Amount in paisa
      purchase_order_id: order._id.toString(),
      purchase_order_name: order.cartData.userId.toString(), // Or customize with user name if available
      customer_info: {
        name: "ROhan", // Replace with actual user name if available
        email: "Rohanmgr130@email.com", // Replace with actual email if available
      },
    };

    if (!process.env.KHALTI_SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Khalti secret key is missing" });
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

    // Respond with Khalti payment URL
    res.status(200).json({
      khaltiPaymentUrl: khaltiResponse.payment_url,
      transactionId: khaltiResponse.pidx,
    });

  } catch (error) {
    console.error("Payment API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { khalti };
