
const express = require("express")
const registerUser = require("../../controllers/User/Register")
const loginUser = require("../../controllers/User/Login")
const userRouter = express.Router()

const {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    applyPromoCode
}
= require("../../controllers/User/MyCart")


//routes

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)


//cart items
userRouter.post("/add-to-cart", addToCart)
userRouter.post("/remove-from-cart", removeFromCart)
userRouter.post("/update-cart-item", updateCartItem)
userRouter.get("/get-cart/:id", getCart)
userRouter.post("/apply-promo-code", applyPromoCode)


module.exports = {userRouter}