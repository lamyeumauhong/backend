const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const CartItem = require("../models/CartModel")
const CartService = require('./CartService')
const EmailService = require("../services/EmailService")

const createOrder = async (newOrder) => {
    try {
        const { userId, paymentMethod, shippingAddress, isPaid, paidAt, email,itemsPrice, totalPrice } = newOrder;

        const cartItems = await CartItem.find({ user: userId });
        if (!cartItems || cartItems.length === 0) {
            return {
                status: 'ERR',
                message: 'Giỏ hàng trống. Không thể tạo đơn hàng.'
            };
        }
        const createdOrder = await Order.create({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            shippingPrice: 0,
            itemsPrice,
            totalPrice, 
            user: userId,
            isPaid,
            paidAt
        });

        if (!createdOrder) {
            return {
                status: 'ERR',
                message: 'Không thể tạo đơn hàng'
            };
        }

        // try {
        //     await EmailService.sendEmailCreateOrder(email,cartItems);
        // } catch (emailError) {
        //     console.error('Lỗi khi gửi email:', emailError);
        //     return {
        //         status: 'ERR',
        //         message: 'Đặt hàng thành công nhưng không thể gửi email thông báo'
        //     };
        // }
        await CartService.clearCart({ user: userId });
        return {
            status: 'OK',
            message: 'Đặt hàng thành công',
            orderId: createdOrder._id
        };
    } catch (e) {
        console.error('Lỗi khi tạo đơn hàng:', e);
        return {
            status: 'ERR',
            message: 'Không thể tạo đơn hàng. Vui lòng thử lại sau.'
        };
    }
};
const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({createdAt: -1, updatedAt: -1})
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                    _id: order.product,
                    selled: {$gte: order.amount}
                    },
                    {$inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }},
                    {new: true}
                )
                if(productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return{
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id
            
            if(newData) {
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${newData} khong ton tai`
                })
            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}