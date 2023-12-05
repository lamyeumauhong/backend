const CartItem = require("../models/CartModel")
const ProductItem = require("../models/ProductModel")
const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const addToCart = async (productId, userId, quantity) => {
    try {
        const session = await CartItem.startSession();
        session.startTransaction();
        
        try {
            const existingCartItem = await CartItem.findOne({ productId: productId, user: userId });   
            let productPrice = 0; 
            const product = await ProductItem.findOne({ _id: productId });
            if (product) {
                productPrice = product.price;
            } else {
                throw new Error('Product not found');
            }
            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                existingCartItem.totalPrice += productPrice * quantity;
                await existingCartItem.save();
            } else {
                await CartItem.create({ productId: productId, user: userId, quantity, totalPrice: productPrice * quantity });
            }

            await session.commitTransaction();

            return {
                status: 'OK',
                message: 'The product has been successfully added.',
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
        await CartItem.deleteMany({ user: userId.user });
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
const updateCartItemQuantity = async (productId, userId, quantity) => {
    try {
        if (quantity <= 0) {
            return {
                status: 'ERR',
                message: 'Quantity should be greater than 0',
            };
        }
        const session = await CartItem.startSession();
        session.startTransaction();
        
        try {
            const cartItem = await CartItem.findOne({ productId: productId, user: userId });
            
            if (!cartItem) {
                return {
                    status: 'ERR',
                    message: 'Product not found in cart',
                };
            }
            const product = await ProductItem.findOne({ _id: productId });
            if (quantity > product.countInStock) {
                return {
                    status: 'ERR',
                    message: 'The quantity being purchased is greater than the available quantity in stock.',
                };
            }
            cartItem.quantity = quantity;
            cartItem.totalPrice = product.price * quantity; 

            await cartItem.save();

            await session.commitTransaction();

            return {
                status: 'OK',
                message: 'Cart item quantity updated successfully',
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
module.exports = {
    addToCart,
    removeProductFromCart,
    clearCart,
    getAllCartItems,
    updateCartItemQuantity
};
