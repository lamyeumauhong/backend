const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare, OrderController.createOrder)
router.get('/get-all-order',authMiddleWare, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',authMiddleWare, OrderController.cancelOrderDetails)
router.get('/get-all-order-by-admin',authUserMiddleWare, OrderController.getAllOrder)

module.exports = router