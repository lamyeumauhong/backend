const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Thêm ref để thiết lập liên kết với mô hình User
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
