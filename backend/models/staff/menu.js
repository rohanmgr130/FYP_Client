const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // Store image URL or filename
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
