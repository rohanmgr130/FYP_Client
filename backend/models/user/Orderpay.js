// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     cartId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Cart",
//       required: true
//     },
//     // Embedded cart data (copy of the cart at order time)
//     cartData: {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       items: [
//         {
//           productId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Menu'
//           },
//           productQuantity: {
//             type: Number,
//             min: 1
//           },
//           price: {
//             type: Number
//           },
//           total: {
//             type: Number
//           }
//         }
//       ],
//       orderTotal: {
//         type: Number
//       },
//       promoCode: {
//         type: String
//       },
//       discount: {
//         type: Number
//       },
//       finalTotal: {
//         type: Number
//       }
//     },
//     orderMethod: {
//       type: String,
//       enum: ["cash-on", "khalti"],
//       required: true,
//     },
//     orderStatus: {
//       type: String,
//       enum: ["pending", "completed", "failed", "verified"],
//       default: "pending",
//     },
//     screenshot: {
//       type: String,
//       default: null
//     },
//     additionalInfo: {
//       type: Object,
//       // For any additional order information
//     }
//   },
//   { timestamps: true }
// );

// // Middleware to copy cart data when creating a new order
// OrderSchema.pre('save', async function(next) {
//   if (this.isNew && this.cartId) {
//     try {
//       // Import Cart model
//       const Cart = mongoose.model('Cart');
      
//       // Find the cart by ID
//       const cart = await Cart.findById(this.cartId);
      
//       if (cart) {
//         // Copy cart data to the order
//         this.cartData = {
//           userId: cart.userId,
//           items: cart.items,
//           orderTotal: cart.orderTotal,
//           promoCode: cart.promoCode,
//           discount: cart.discount,
//           finalTotal: cart.finalTotal
//         };
//       }
      
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("Orderpay", OrderSchema);



const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true
    },
    // Embedded cart data (copy of the cart at order time)
    cartData: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
          },
          productQuantity: {
            type: Number,
            min: 1
          },
          price: {
            type: Number
          },
          total: {
            type: Number
          }
        }
      ],
      orderTotal: {
        type: Number
      },
      promoCode: {
        type: String
      },
      discount: {
        type: Number
      },
      finalTotal: {
        type: Number
      }
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
    screenshot: {
      type: String,
      default: null
    },
    additionalInfo: {
      type: Object,
      // For any additional order information
    }
  },
  { timestamps: true }
);

// Middleware to copy cart data when creating a new order
OrderSchema.pre('save', async function(next) {
  if (this.isNew && this.cartId) {
    try {
      // Import Cart model
      const Cart = mongoose.model('Cart');
      
      // Find the cart by ID
      const cart = await Cart.findById(this.cartId);
      
      if (cart) {
        // Copy cart data to the order
        this.cartData = {
          userId: cart.userId,
          items: cart.items,
          orderTotal: cart.orderTotal,
          promoCode: cart.promoCode,
          discount: cart.discount,
          finalTotal: cart.finalTotal
        };
      }
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Orderpay", OrderSchema);