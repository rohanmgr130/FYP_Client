const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },
  image: {
    type: String,
    required: [true, "Category image is required"]
  },
  isActive: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
