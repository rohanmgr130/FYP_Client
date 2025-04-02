const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  orderDate: { type: Date, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
