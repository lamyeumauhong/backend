const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const response = await CartService.addToCart(productId, userId, quantity);
        
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

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        const response = await CartService.removeProductFromCart(productId, userId);
        
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
const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const response = await CartService.updateCartItemQuantity(productId, userId, quantity);

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



module.exports = {
    addToCart,
    removeFromCart,
    clearCart,
    getAllCartItems,
    updateCartItemQuantity
};
