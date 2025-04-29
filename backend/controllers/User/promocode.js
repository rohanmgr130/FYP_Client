// controllers/User/promoCodeController.js
const PromoCode = require('../../models/admin/promocode');
const Cart = require('../../models/user/MyCart');

// Apply promo code to cart
exports.applyPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        // Find the promo code in the database
        const promo = await PromoCode.findOne({ 
            code: promoCode.toUpperCase(),
            isActive: true,
            isUsed: false,
            expiryDate: { $gt: new Date() }
        });

        if (!promo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired promo code' 
            });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Calculate the order total from items
        const orderTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.orderTotal = orderTotal;

        // Check minimum order value
        if (promo.minOrderValue > 0 && orderTotal < promo.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order value of Rs. ${promo.minOrderValue} required to use this code`
            });
        }

        let discount = 0;
        let message = '';

        // Calculate discount based on type
        if (promo.discountType === 'percentage') {
            discount = Math.round(orderTotal * (promo.discountValue / 100));
            
            // Apply maximum discount cap if set
            if (promo.maxDiscountAmount && discount > promo.maxDiscountAmount) {
                discount = promo.maxDiscountAmount;
            }
            
            message = `${promo.discountValue}% discount applied`;
        } else {
            // Fixed amount discount
            discount = promo.discountValue;
            message = `Rs. ${promo.discountValue} discount applied`;
        }

        // Ensure discount doesn't exceed order total
        if (discount > orderTotal) {
            discount = orderTotal;
        }

        // Update cart with discount
        cart.discount = discount;
        cart.promoCode = promoCode.toUpperCase();
        cart.finalTotal = orderTotal - discount;

        // Save updated cart
        await cart.save();

        // Format cart response
        const response = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items,
            orderTotal,
            discount,
            promoCode: cart.promoCode,
            finalTotal: cart.finalTotal
        };

        res.status(200).json({ 
            success: true, 
            message, 
            cart: response 
        });
    } catch (error) {
        console.error('Error applying promo code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Remove promo code from cart
exports.removePromoCode = async (req, res) => {
    try {
        const { userId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Reset promo code and discount
        cart.promoCode = null;
        cart.discount = 0;
        
        // Calculate totals
        cart.orderTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
        cart.finalTotal = cart.orderTotal;

        await cart.save();

        // Format cart response
        const response = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items,
            orderTotal: cart.orderTotal,
            discount: cart.discount,
            promoCode: cart.promoCode,
            finalTotal: cart.finalTotal
        };

        res.status(200).json({
            success: true,
            message: 'Promo code removed successfully',
            cart: response
        });
    } catch (error) {
        console.error('Error removing promo code:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get available promo codes for user
exports.getAvailablePromoCodes = async (req, res) => {
    try {
        // Find active and valid promo codes
        const promoCodes = await PromoCode.find({
            isActive: true,
            isUsed: false,
            expiryDate: { $gt: new Date() }
        });
        
        // Format response
        const formattedCodes = promoCodes.map(code => ({
            code: code.code,
            discountType: code.discountType,
            discountValue: code.discountValue,
            minOrderValue: code.minOrderValue,
            expiryDate: code.expiryDate
        }));
        
        res.status(200).json({
            success: true,
            count: formattedCodes.length,
            promoCodes: formattedCodes
        });
    } catch (error) {
        console.error('Error fetching available promo codes:', error);
        res.status(500).json({
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
};

// Finalize promo code when order is placed
exports.finalizePromoCode = async (userId, promoCode) => {
    if (!promoCode) return;
    
    try {
        // Find the promo code
        const promo = await PromoCode.findOne({ code: promoCode });
        if (!promo) return;
        
        // Mark as used by this user
        promo.isUsed = true;
        promo.usedBy = userId;
        promo.usedAt = new Date();
        
        await promo.save();
    } catch (error) {
        console.error('Error finalizing promo code:', error);
    }
};