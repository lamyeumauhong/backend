const CartItem = require("../models/CartModel")
const ProductItem = require("../models/ProductModel")
const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const addToCart = async (productId,userId, quantity, totalPrice) => {
    try {
        console.log('productId',productId)
        const session = await CartItem.startSession();
        session.startTransaction();
        try {
            const existingCartItem = await CartItem.findOne({ productId: productId, user: userId });

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                existingCartItem.totalPrice += totalPrice;
                await existingCartItem.save();
            } else {
                await CartItem.create({ productId: productId, user: userId, quantity, totalPrice });
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
const getAllCartItems = async (userId) => {
    try {
        const cartItems = await CartItem.find({ user: userId });

        const cartItemsWithProductInfo = await Promise.all(cartItems.map(async (cartItem) => {
            const productInfo = await ProductItem.findById(cartItem.productId);
            return {
                cartItem,
                productInfo,
            };
        }));

        return {
            status: 'OK',
            message: 'Success',
            data: cartItemsWithProductInfo,
        };
    } catch (error) {
        throw error;
    }
};
const removeProductFromCart = async (productId, userId) => {
    try {
        const cartItem = await CartItem.findOne({ productId: productId, user: userId });
        if (!cartItem) {
            return {
                status: 'ERR',
                message: 'Product not found in cart',
            };
        }
        await cartItem.deleteOne();

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
    removeProductFromCart,
    clearCart,
    getAllCartItems
};
