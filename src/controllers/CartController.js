const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, totalPrice } = req.body;
        const userId = req.user.id; // Sử dụng ngay req.user.id nếu tồn tại

        const response = await CartService.addToCart(productId, userId, quantity, totalPrice);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
        });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.body;

        const response = await CartService.removeCartItem(cartItemId);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id; // Sử dụng ngay req.user.id nếu tồn tại

        const response = await CartService.clearCart(userId);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
        });
    }
};

module.exports = {
    addToCart,
    removeCartItem,
    clearCart,
};
