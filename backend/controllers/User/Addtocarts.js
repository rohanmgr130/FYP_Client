const AddToCart = require("../../models/user/Addtocart");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const {  productId, quantity } = req.body;
    console.log(userId)

    let cart = await AddToCart.findOne({ userId });

    if (!cart) {
      cart = new AddToCart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await AddToCart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await AddToCart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity > 0 ? quantity : 1;
      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await AddToCart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    await AddToCart.findOneAndDelete({ userId });

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
