// const Cart = require('../../models/user/MyCart');
// const Menu = require('../../models/staff/menu');

// // Helper to calculate totals and return a clean response
// const formatCartResponse = (cart) => {
//     const orderTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
//     const discount = cart.discount || 0;
//     const finalTotal = orderTotal - discount;

//     cart.orderTotal = orderTotal;
//     cart.finalTotal = finalTotal;

//     return {
//         _id:cart._id,
//         userId: cart.userId,
//         items: cart.items,
//         orderTotal,
//         discount,
//         promoCode: cart.promoCode || null,
//         finalTotal
//     };
// };

// // Add item to cart
// const addToCart = async (req, res) => {
//     try {
//         const { userId, productId, productQuantity } = req.body;

//         const product = await Menu.findById(productId);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         let cart = await Cart.findOne({ userId });
//         if (!cart) cart = new Cart({ userId, items: [] });

//         const existingItem = cart.items.find(item => item.productId.toString() === productId);

//         if (existingItem) {
//             existingItem.productQuantity += productQuantity;
//             existingItem.total = existingItem.productQuantity * product.price;
//         } else {
//             cart.items.push({
//                 productId,
//                 productQuantity,
//                 price: product.price,
//                 total: product.price * productQuantity,
//                 isPlacedOrder: false
//             });
//         }

//         const response = formatCartResponse(cart);
//         await cart.save();

//         res.status(200).json({ success: true, message: 'Item added to cart', cart: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// // Remove item from cart
// const removeFromCart = async (req, res) => {
//     try {
//         const { userId, productId } = req.body;

//         let cart = await Cart.findOne({ userId });
//         if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

//         const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
//         if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

//         cart.items.splice(itemIndex, 1);

//         const response = formatCartResponse(cart);
//         await cart.save();

//         res.status(200).json({ success: true, message: 'Item removed from cart', cart: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// // Update item quantity in cart
// const updateCartItem = async (req, res) => {
//     try {
//         const { userId, productId, productQuantity } = req.body;

//         let cart = await Cart.findOne({ userId });
//         if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

//         const item = cart.items.find(item => item.productId.toString() === productId);
//         if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

//         if (productQuantity <= 0) {
//             cart.items = cart.items.filter(item => item.productId.toString() !== productId);
//         } else {
//             item.productQuantity = productQuantity;
//             item.total = item.productQuantity * item.price;
//         }

//         const response = formatCartResponse(cart);
//         await cart.save();

//         res.status(200).json({ success: true, message: 'Cart updated', cart: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// // Get user cart
// const getCart = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         const cart = await Cart.findOne({ userId }).populate('items.productId');
        

//         if (!cart) {
//             return res.status(200).json({
//                 userId,
//                 items: [],
//                 orderTotal: 0,
//                 discount: 0,
//                 finalTotal: 0,
//                 promoCode: null
//             });
//         }

//         const response = formatCartResponse(cart);
//         await cart.save();

//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// // Apply promo code
// const applyPromoCode = async (req, res) => {
//     try {
//         const { userId, promoCode } = req.body;

//         let cart = await Cart.findOne({ userId });
//         if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

//         let discountPercent = 0;
//         let message = '';
//         const promo = promoCode.toUpperCase();

//         switch (promo) {
//             case 'DISCOUNT10':
//                 discountPercent = 10;
//                 message = '10% discount applied';
//                 break;
//             case 'WELCOME20':
//                 discountPercent = 20;
//                 message = '20% discount applied';
//                 break;
//             case 'SPECIAL25':
//                 discountPercent = 25;
//                 message = '25% discount applied';
//                 break;
//             case 'FREESHIP':
//                 cart.discount = 50;
//                 cart.promoCode = promo;
//                 break;
//             default:
//                 return res.status(400).json({ success: false, message: 'Invalid promo code' });
//         }

//         if (promo !== 'FREESHIP') {
//             cart.discount = Math.round(cart.orderTotal * (discountPercent / 100));
//             cart.promoCode = promo;
//         }

//         const response = formatCartResponse(cart);
//         await cart.save();

//         res.status(200).json({ success: true, message, cart: response });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// // Clear cart
// const clearCart = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         let cart = await Cart.findOne({ userId });
//         if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

//         cart.items = [];
//         cart.orderTotal = 0;
//         cart.discount = 0;
//         cart.promoCode = null;
//         cart.finalTotal = 0;

//         await cart.save();

//         res.status(200).json({ success: true, message: 'Cart cleared successfully', cart: formatCartResponse(cart) });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error', error });
//     }
// };

// module.exports = {
//     addToCart,
//     removeFromCart,
//     updateCartItem,
//     getCart,
//     applyPromoCode,
//     clearCart
// };


const Cart = require('../../models/user/MyCart');
const Menu = require('../../models/staff/menu');
const PromoCode = require('../../models/admin/promocode');

// Helper to calculate totals and return a clean response
const formatCartResponse = (cart) => {
    const orderTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    const discount = cart.discount || 0;
    const finalTotal = orderTotal - discount;

    cart.orderTotal = orderTotal;
    cart.finalTotal = finalTotal;

    return {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        orderTotal,
        discount,
        promoCode: cart.promoCode || null,
        finalTotal
    };
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, productQuantity } = req.body;

        const product = await Menu.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.productQuantity += productQuantity;
            existingItem.total = existingItem.productQuantity * product.price;
        } else {
            cart.items.push({
                productId,
                productQuantity,
                price: product.price,
                total: product.price * productQuantity,
                isPlacedOrder: false
            });
        }

        const response = formatCartResponse(cart);
        await cart.save();

        res.status(200).json({ success: true, message: 'Item added to cart', cart: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        cart.items.splice(itemIndex, 1);

        const response = formatCartResponse(cart);
        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, productQuantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        if (productQuantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            item.productQuantity = productQuantity;
            item.total = item.productQuantity * item.price;
        }

        const response = formatCartResponse(cart);
        await cart.save();

        res.status(200).json({ success: true, message: 'Cart updated', cart: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.params.id;

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(200).json({
                userId,
                items: [],
                orderTotal: 0,
                discount: 0,
                finalTotal: 0,
                promoCode: null
            });
        }

        const response = formatCartResponse(cart);
        await cart.save();

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Apply promo code
const applyPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        // Calculate the order total from items
        const orderTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.orderTotal = orderTotal;

        // Find the promo code in the database
        const promoCodeUpper = promoCode.toUpperCase();
        const promoCodeDoc = await PromoCode.findOne({ code: promoCodeUpper });

        if (!promoCodeDoc) {
            return res.status(400).json({ success: false, message: 'Invalid promo code' });
        }

        if (promoCodeDoc.isUsed) {
            return res.status(400).json({ success: false, message: 'This promo code has already been used' });
        }

        if (promoCodeDoc.expiryDate && new Date() > promoCodeDoc.expiryDate) {
            return res.status(400).json({ success: false, message: 'This promo code has expired' });
        }

        // Apply the discount based on the promo code type and value
        if (promoCodeDoc.discountType === 'percentage') {
            // Percentage discount
            cart.discount = Math.round(orderTotal * (promoCodeDoc.discountValue / 100));
        } else if (promoCodeDoc.discountType === 'fixed') {
            // Fixed amount discount
            cart.discount = promoCodeDoc.discountValue;
        }

        // Ensure discount doesn't exceed order total
        if (cart.discount > orderTotal) {
            cart.discount = orderTotal;
        }

        // Save the promo code to the cart
        cart.promoCode = promoCodeUpper;
        
        // Calculate final total
        cart.finalTotal = orderTotal - cart.discount;

        // Save updated cart
        await cart.save();

        // Get updated values after save
        const response = formatCartResponse(cart);

        res.status(200).json({ 
            success: true, 
            message: `Discount of ${promoCodeDoc.discountType === 'percentage' ? promoCodeDoc.discountValue + '%' : 'Rs. ' + promoCodeDoc.discountValue} applied`, 
            cart: response 
        });
    } catch (error) {
        console.error('Error applying promo code:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = [];
        cart.orderTotal = 0;
        cart.discount = 0;
        cart.promoCode = null;
        cart.finalTotal = 0;

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart cleared successfully', cart: formatCartResponse(cart) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Finalize the promo code by marking it as used
const finalizePromoCode = async (userId, promoCode) => {
    if (!promoCode) return;
    
    try {
        // Find the promo code document
        const promoDoc = await PromoCode.findOne({ code: promoCode });
        if (!promoDoc) return;
        
        // Mark as used
        promoDoc.isUsed = true;
        promoDoc.usedBy = userId;
        promoDoc.usedAt = new Date();
        
        await promoDoc.save();
    } catch (error) {
        console.error('Error finalizing promo code:', error);
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    applyPromoCode,
    clearCart,
    finalizePromoCode
};