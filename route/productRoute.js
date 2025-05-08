
const router = require('express').Router();
const { authentication, restrictTo } = require('../controller/authController');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController');


router.post('/', authentication, restrictTo('1'), createProduct);
router.get('/', authentication, restrictTo('1'), getAllProducts);
router.get('/:id', authentication, restrictTo('1'), getProductById);
router.patch('/:id', authentication, restrictTo('1'), updateProduct);
router.delete('/:id', authentication, restrictTo('1'), deleteProduct);
module.exports = router;
