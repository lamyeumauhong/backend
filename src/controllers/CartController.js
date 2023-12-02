const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, totalPrice } = req.body;
        const userId = req.user.id;
        console.log('productId',productId)
        const response = await CartService.addToCart(productId,userId, quantity, totalPrice);
        
        if (response.status === 'OK') {
            res.status(200).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
        });
    }
};
const getAllCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await CartService.getAllCartItems(userId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.body;

        const userId = req.user.id;
        const response = await CartService.removeCartItem(cartItemId, userId);
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
        const userId = req.user.id;
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
    getAllCartItems
};
