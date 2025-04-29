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
      enum: ["vegetarian", "non-vegetarian"], // Allowed types
    },
    categories: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
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
