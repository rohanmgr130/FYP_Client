const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["vegetarian", "non-vegetarian", "drinks", "breakfast"], // Allowed types
    },
    categories: {
      type: [String], // Array of categories
      required: true,
    },
    image: {
      type: String, // Store the image URL or file path
      // required: true,
    },
    menuType:{
      type:String,
      required:true,
      enum:["todays-special","normal", "best-seller"],
      default:"normal"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
