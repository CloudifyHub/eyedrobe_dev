
const router = require('express').Router();
const { authentication, restrictTo } = require('../controller/authController');
const { createProduct, getAllProducts } = require('../controller/productController');


router.post('/', authentication, restrictTo('1'), createProduct);
router.get('/', authentication, restrictTo('1'), getAllProducts);
module.exports = router;
