const CartItem = require("../models/CartModel")

const addToCart = async (productId, userId, quantity, totalPrice) => {
    try {
        const session = await CartItem.startSession();
        session.startTransaction();

        try {
            const existingCartItem = await CartItem.findOne({ product: productId, user: userId });

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                existingCartItem.totalPrice += totalPrice;
                await existingCartItem.save();
            } else {
                await CartItem.create({ product: productId, user: userId, quantity, totalPrice });
            }

            await session.commitTransaction();

            return {
                status: 'OK',
                message: 'Product added to cart successfully',
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const removeCartItem = async (cartItemId) => {
    try {
        const cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            return {
                status: 'ERR',
                message: 'CartItem not found',
            };
        }

        await cartItem.remove();

        return {
            status: 'OK',
            message: 'Product removed from cart successfully',
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const clearCart = async (userId) => {
    try {
        // Xóa toàn bộ giỏ hàng của người dùng
        await CartItem.deleteMany({ user: userId });

        return {
            status: 'OK',
            message: 'Cart cleared successfully',
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

module.exports = {
    addToCart,
    removeCartItem,
    clearCart,
};
