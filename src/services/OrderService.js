const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const CartItem = require("../models/CartModel")
const CartService = require('./CartService')
const EmailService = require("../services/EmailService")

const createOrder = async (newOrder) => {
    try {
        const { userId, paymentMethod, shippingAddress, isPaid, paidAt, email, itemsPrice, totalPrice } = newOrder;

        const cartItems = await CartItem.find({ user: userId });
        if (!cartItems || cartItems.length === 0) {
            return {
                status: 'ERR',
                message: 'Giỏ hàng trống. Không thể tạo đơn hàng.'
            };
        }
        // Kiểm tra số lượng trong giỏ hàng so với số lượng tồn kho của sản phẩm
        for (const cartItem of cartItems) {
            const product = await Product.findById(cartItem.productId);
            if (!product || cartItem.quantity > product.countInStock) {
                return {
                    status: 'ERR',
                    message: `Số lượng của sản phẩm ${product.name} trong giỏ hàng vượt quá số lượng tồn kho.`,
                };
            }
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
            paidAt: isPaid ? new Date() : null
        });

        if (!createdOrder) {
            return {
                status: 'ERR',
                message: 'Không thể tạo đơn hàng'
            };
        }

        try {
            await EmailService.sendEmailCreateOrder(email, createdOrder.orderItems);
        } catch (emailError) {
            console.error('Lỗi khi gửi email:', emailError);
            return {
                status: 'ERR',
                message: 'Đặt hàng thành công nhưng không thể gửi email thông báo'
            };
        }
        // Trừ số lượng sản phẩm trong giỏ hàng khỏi số lượng trong kho
        for (const cartItem of cartItems) {
            await Product.findOneAndUpdate(
                { _id: cartItem.productId },
                {
                    $inc: {
                        countInStock: -cartItem.quantity,
                        selled: cartItem.quantity,
                    },
                }
            );
        }
        await CartService.clearCart({ user: userId })

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

const cancelOrderDetails = async (id, data) => {
    try {
        const promises = data.map(async (order) => {
            const productData = await Product.findOneAndUpdate(
                {
                    _id: order.product,
                },
                {
                    $inc: {
                        countInStock: +order.amount,
                        selled: -order.amount,
                    },
                },
                { new: true }
            );

            if (!productData) {
                return {
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại',
                    id: order.product,
                };
            }
        });

        const results = await Promise.all(promises);
        const newData = results.find((result) => result && result.status === 'ERR');

        if (newData) {
            return {
                status: 'ERR',
                message: `Sản phẩm với id: ${newData.id} không tồn tại`
            };
        }

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return {
                status: 'ERR',
                message: 'Đơn hàng không tồn tại'
            };
        }

        return {
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: deletedOrder
        };
    } catch (e) {
        console.error('Lỗi khi hủy đơn hàng:', e);
        return {
            status: 'ERR',
            message: 'Không thể hủy đơn hàng. Vui lòng thử lại sau.'
        };
    }
};

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