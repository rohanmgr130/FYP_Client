
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    rewardPoints: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["vegetarian", "non-vegetarian" , "drinks"], // Allowed types
    },
    categories: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardMenu", rewardSchema);