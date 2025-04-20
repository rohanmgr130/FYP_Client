const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Favorites", favoritesSchema);