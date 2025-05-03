const Cart = require('../../models/user/MyCart');
const Menu = require('../../models/staff/menu');
const PromoCode = require('../../models/admin/promocode');

// Helper to calculate totals and return a clean response
const formatCartResponse = (cart) => {
    // Filter out any items with null productId
    const validItems = cart.items.filter(item => 
        item.productId && (typeof item.productId === 'object' ? true : item.productId)
    );
    
    const orderTotal = validItems.reduce((sum, item) => sum + item.total, 0);
    const discount = cart.discount || 0;
    const finalTotal = orderTotal - discount;

    return {
        _id: cart._id,
        userId: cart.userId,
        items: validItems,
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

        const existingItem = cart.items.find(item => 
            item.productId && item.productId.toString() === productId
        );

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

        await cart.save();
        const response = formatCartResponse(cart);

        res.status(200).json({ success: true, message: 'Item added to cart', cart: response });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => 
            item.productId && item.productId.toString() === productId
        );
        
        if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        cart.items.splice(itemIndex, 1);

        await cart.save();
        const response = formatCartResponse(cart);

        res.status(200).json({ success: true, message: 'Item removed from cart', cart: response });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, productQuantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const item = cart.items.find(item => 
            item.productId && item.productId.toString() === productId
        );
        
        if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

        if (productQuantity <= 0) {
            cart.items = cart.items.filter(item => 
                item.productId && item.productId.toString() !== productId
            );
        } else {
            item.productQuantity = productQuantity;
            item.total = item.productQuantity * item.price;
        }

        await cart.save();
        const response = formatCartResponse(cart);

        res.status(200).json({ success: true, message: 'Cart updated', cart: response });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get user cart with proper population and error handling
const getCart = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(`Getting cart for user: ${userId}`);

        // Find the cart and populate product information
        let cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                model: 'Menu', // Ensure this matches your Menu model's name in mongoose.model()
                select: 'title image price type' // Include all fields you need
            });

        if (!cart) {
            console.log(`No cart found for user: ${userId}, creating empty response`);
            return res.status(200).json({
                userId,
                items: [],
                orderTotal: 0,
                discount: 0,
                finalTotal: 0,
                promoCode: null
            });
        }

        // Check for and cleanup any invalid items (null productId)
        const validItemsCount = cart.items.filter(item => item.productId).length;
        console.log(`Cart found with ${cart.items.length} items, ${validItemsCount} valid items`);
        
        if (validItemsCount !== cart.items.length) {
            console.log('Found null productIds in cart, cleaning up...');
            // Filter out invalid items
            cart.items = cart.items.filter(item => item.productId);
            // Save the cleaned cart
            await cart.save();
        }

        // Format and return response
        const response = formatCartResponse(cart);
        console.log(`Responding with cart: ${response.items.length} items, total: ${response.finalTotal}`);
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching cart', 
            error: error.message 
        });
    }
};

// Apply promo code
const applyPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        // Filter out invalid items
        cart.items = cart.items.filter(item => item.productId);
        
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
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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