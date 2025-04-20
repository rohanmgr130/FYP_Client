const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
   
   cartId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cart",
    required:true
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
      // For storing the path to the uploaded screenshot
      default:null
    },
    additionalInfo: {
      type: Object,
      // For any additional order information
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orderpay", OrderSchema);