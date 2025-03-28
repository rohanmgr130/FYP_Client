const express = require("express");
const { addToCart, getCart, updateCartItem, removeCartItem, clearCart } = require("../../controllers/User/Addtocarts");

const router = express.Router();

router.post("/add", addToCart);  
router.get("/:userId", getCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.delete("/clear", clearCart);

module.exports = router;
