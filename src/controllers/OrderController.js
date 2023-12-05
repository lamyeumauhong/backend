const OrderService = require('../services/OrderService')
const CartItem = require("../models/CartModel")
const User = require("../models/UserModel")


const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingAddress, isPaid, paidAt, totalPrice, itemsPrice } = req.body;
        const userId = req.user.id;

        // Fetch user information based on userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User not found.'
            });
        }

        const cartItems = await CartItem.find({ user: userId });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Giỏ hàng trống. Không thể tạo đơn hàng.'
            });
        }

        const response = await OrderService.createOrder({
            userId,
            paymentMethod,
            shippingAddress,
            totalPrice,
            itemsPrice,
            isPaid,
            paidAt,
            email: user.email 
        });

        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message || 'Internal Server Error'
        });
    }
};

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data= req.params.orderItems
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}