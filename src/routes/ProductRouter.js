const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',authUserMiddleWare, ProductController.createProduct)
router.put('/update/:id', authUserMiddleWare, ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete/:id', authUserMiddleWare, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.post('/delete-many', authUserMiddleWare, ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)

module.exports = router