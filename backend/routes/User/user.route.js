
const express = require("express")
const registerUser = require("../../controllers/User/Register")
const loginUser = require("../../controllers/User/Login")
const userRouter = express.Router()


//routes

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)


module.exports = {userRouter}