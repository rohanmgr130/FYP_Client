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
      enum: ["pending", "completed", "failed", "verified"],
      default: "pending",
    },
    additionalInfo: Object,

    // Embedded Khalti payment info
    khaltiPayment: {
      pidx: String,
      paymentUrl: String,
      status: {
        type: String,
        enum: ["initiated", "completed", "failed"],
        default: "initiated",
      },
      amount: Number,
    },
  },
  { timestamps: true }
);

// Copy cart data before saving
OrderSchema.pre("save", async function (next) {
  if (!this.isNew || !this.cartId) return next();

  const Cart = mongoose.model("Cart");
  const cart = await Cart.findById(this.cartId);
  if (cart) {
    this.cartData = {
      userId: cart.userId,
      items: cart.items,
      orderTotal: cart.orderTotal,
      promoCode: cart.promoCode,
      discount: cart.discount,
      finalTotal: cart.finalTotal,
    };
  }
  next();
});

module.exports = mongoose.model("Orderpay", OrderSchema);
