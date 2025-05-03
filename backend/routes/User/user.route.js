const express = require("express");
const loginUser = require("../../controllers/User/Login");
const userRouter = express.Router();

const {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  applyPromoCode,
  clearCart
} = require("../../controllers/User/MyCart");

const promoCodeController = require('../../controllers/admin/Promocode');

// Authentication
userRouter.post("/login", loginUser);

// 🛒 Cart routes
userRouter.post("/add-to-cart", addToCart);
userRouter.post("/remove-from-cart", removeFromCart);
userRouter.post("/update-cart-item", updateCartItem);
userRouter.get("/get-cart/:id", getCart);
userRouter.post("/apply-promo-code", applyPromoCode);
userRouter.post("/clear-cart", clearCart);

// Promo code features
userRouter.post("/apply-dynamic-promo-code", promoCodeController.applyPromoCode);
userRouter.post("/remove-promo-code", promoCodeController.removePromoCode);
userRouter.get("/available-promo-codes", promoCodeController.getAvailablePromoCodes);

module.exports = { userRouter };
