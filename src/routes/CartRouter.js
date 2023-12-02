const express = require("express");
const router = express.Router()
const CartController = require('../controllers/CartController');
const {authMiddleWare} = require("../middleware/authMiddleware");

router.post('/add-to-cart', authMiddleWare, CartController.addToCart);
router.delete('/remove-cart-item', authMiddleWare, CartController.removeCartItem);
router.delete('/clear-cart', authMiddleWare, CartController.clearCart);
router.get('/all',authMiddleWare, CartController.getAllCartItems);

module.exports = router
