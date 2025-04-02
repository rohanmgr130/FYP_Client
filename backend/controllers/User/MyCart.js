const Cart = require('../../models/user/MyCart')
const Menu = require('../../models/staff/menu')

// Add item to cart
const addToCart = async (req, res) => {
    
    try {
        
        const { userId, productId, productQuantity } = req.body;

        // Validate product existence
        const product = await Menu.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.productQuantity += productQuantity;
            existingItem.total = existingItem.productQuantity * product.price;
        } else {
            cart.items.push({
                productId,
                productQuantity,
                price: product.price,
                total: product.price * productQuantity
            });
        }

        await cart.save();
        res.status(200).json({success:true, message: 'Item added to cart', cart });

    } catch (error) {
        res.status(500).json({success:false, message: 'Server error', error });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, productQuantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (productQuantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            item.productQuantity = productQuantity;
            item.total = item.productQuantity * item.price;
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated', cart });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get user cart
const getCart = async (req, res) => {
    
    try {
        const userId = req.params.id

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Apply promo code
const applyPromoCode = async (req, res) => {
    try {
        const { userId, promoCode } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Basic promo code logic (you can enhance this)
        if (promoCode === 'DISCOUNT10') {
            cart.discount = cart.orderTotal * 0.1; // 10% discount
        } else {
            return res.status(400).json({ message: 'Invalid promo code' });
        }

        cart.finalTotal = cart.orderTotal - cart.discount;
        await cart.save();

        res.status(200).json({ message: 'Promo code applied', cart });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports =  {
    addToCart,
    removeFromCart,
    updateCartItem,
    getCart,
    applyPromoCode
}
