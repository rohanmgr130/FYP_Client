// Update routes/User/routes.js
const express = require("express")
const registerUser = require("../../controllers/User/Register")
const loginUser = require("../../controllers/User/Login")
const userRouter = express.Router()

const {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    applyPromoCode,
    clearCart
} = require("../../controllers/User/MyCart")

// Import promo code controller
const promoCodeController = require('../../controllers/admin/Promocode')

// User authentication routes
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

// Cart routes
userRouter.post("/add-to-cart", addToCart)
userRouter.post("/remove-from-cart", removeFromCart)
userRouter.post("/update-cart-item", updateCartItem)
userRouter.get("/get-cart/:id", getCart)
userRouter.post("/apply-promo-code", applyPromoCode) // Keep legacy route
userRouter.post("/clear-cart", clearCart)

// New promo code routes
userRouter.post("/apply-dynamic-promo-code", promoCodeController.applyPromoCode)
userRouter.post("/remove-promo-code", promoCodeController.removePromoCode)
userRouter.get("/available-promo-codes", promoCodeController.getAvailablePromoCodes)

module.exports = { userRouter }






// const express = require("express");
// const registerUser = require("../../controllers/User/Register");
// const loginUser = require("../../controllers/User/Login");
// const { authenticateUser } = require("../../middleware/authMiddleware");
// const userRouter = express.Router();

// // Import cart controllers
// const {
//     addToCart,
//     removeFromCart,
//     updateCartItem,
//     getCart,
//     applyPromoCode,
//     clearCart
// } = require("../../controllers/User/MyCart");

// // User authentication routes
// userRouter.post("/register", registerUser);
// userRouter.post("/login", loginUser);

// // Public cart routes (requires userId in body or params)
// userRouter.post("/add-to-cart", addToCart);
// userRouter.post("/remove-from-cart", removeFromCart);
// userRouter.post("/update-cart-item", updateCartItem);
// userRouter.get("/get-cart/:id", getCart);
// userRouter.post("/apply-promo-code", applyPromoCode);
// userRouter.post("/clear-cart", clearCart);

// // Protected user profile routes (requires authentication)
// userRouter.get("/profile", authenticateUser, (req, res) => {
//     // This assumes your authentication middleware adds the user object to the request
//     const user = req.user;
    
//     // Return user profile without sensitive information
//     res.status(200).json({
//         success: true,
//         user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             phone: user.phone,
//             role: user.role,
//             createdAt: user.createdAt
//         }
//     });
// });

// // Update user profile
// userRouter.put("/profile", authenticateUser, async (req, res) => {
//     try {
//         const { name, phone, address } = req.body;
//         const userId = req.user._id;

//         // Find user model - assuming you have a User model
//         const User = require("../../models/User");
        
//         // Update user profile
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { 
//                 name, 
//                 phone, 
//                 address 
//             },
//             { new: true, runValidators: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             user: {
//                 _id: updatedUser._id,
//                 name: updatedUser.name,
//                 email: updatedUser.email,
//                 phone: updatedUser.phone,
//                 address: updatedUser.address,
//                 role: updatedUser.role,
//                 createdAt: updatedUser.createdAt
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error updating profile",
//             error: error.message
//         });
//     }
// });

// // Change password
// userRouter.post("/change-password", authenticateUser, async (req, res) => {
//     try {
//         const { currentPassword, newPassword } = req.body;
//         const userId = req.user._id;

//         // Find user model
//         const User = require("../../models/User");
//         const bcrypt = require("bcryptjs");
        
//         // Get user with password
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Check if current password is correct
//         const isMatch = await bcrypt.compare(currentPassword, user.password);
        
//         if (!isMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Current password is incorrect"
//             });
//         }

//         // Hash new password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);
        
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Password changed successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error changing password",
//             error: error.message
//         });
//     }
// });

// // Get user's order history - basic version that redirects to order routes
// userRouter.get("/my-orders", authenticateUser, (req, res) => {
//     const userId = req.user._id;
//     // Redirect to order routes for consistent handling
//     res.redirect(`/api/order/my-orders/${userId}`);
// });

// // Logout route (if using JWT, client-side logout is sufficient)
// userRouter.post("/logout", (req, res) => {
//     // If using cookies or sessions:
//     // req.session.destroy();
//     // or
//     // res.clearCookie('token');
    
//     res.status(200).json({
//         success: true,
//         message: "Logged out successfully"
//     });
// });

// module.exports = { userRouter };