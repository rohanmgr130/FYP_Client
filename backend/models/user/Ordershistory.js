const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orderpay", // Reference to Orderpay schema
      },
    ],
    totalAmount: {
      type: Number, 
      default: 0, // Aggregate total of all orders
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("OrderHistory", OrderHistorySchema);


