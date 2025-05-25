
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    cartData: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
          productQuantity: Number,
          price: Number,
          total: Number,
          productName: String // Fallback name in case product is deleted
        },
      ],
      orderTotal: Number,
      promoCode: String,
      discount: Number,
      finalTotal: Number,
    },
    orderMethod: {
      type: String,
      enum: ["cash-on", "khalti"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Verified", "Preparing"],
      default: "Pending",
    },
    additionalInfo: Object,

    // Embedded Khalti payment info
    khaltiPayment: {
      pidx: String,
      paymentUrl: String,
      status: {
        type: String,
        enum: ["completed", "failed"],
        default: "completed",
      },
      amount: Number,
      // Add verification date and transaction details
      verifiedAt: Date,
      transactionDetails: Object
    },
  },
  { timestamps: true }
);

// Pre-save middleware to ensure final amounts are calculated correctly
OrderSchema.pre("save", async function (next) {
  try {
    // For new orders, copy cart data if cartId exists
    if (this.isNew && this.cartId) {
      const Cart = mongoose.model("Cart");
      const cart = await Cart.findById(this.cartId);
      
      if (cart) {
        // Calculate order total from items to ensure it's correct
        const orderTotal = cart.items.reduce((sum, item) => sum + (item.total || 0), 0);
        const discount = cart.discount || 0;
        const finalTotal = orderTotal - discount;
        
        this.cartData = {
          userId: cart.userId,
          items: cart.items,
          orderTotal: orderTotal,
          promoCode: cart.promoCode,
          discount: discount,
          finalTotal: finalTotal,
        };
      }
    }
    
    // For existing orders, ensure finalTotal is always calculated correctly
    if (this.cartData) {
      if (!this.cartData.orderTotal && this.cartData.items && this.cartData.items.length > 0) {
        this.cartData.orderTotal = this.cartData.items.reduce((sum, item) => sum + (item.total || 0), 0);
      }
      
      if (this.cartData.orderTotal) {
        this.cartData.discount = this.cartData.discount || 0;
        this.cartData.finalTotal = this.cartData.orderTotal - this.cartData.discount;
      }
    }
    
    next();
  } catch (error) {
    console.error("Error in order pre-save hook:", error);
    next(error);
  }
});

module.exports = mongoose.model("Orderpay", OrderSchema);