const router = require('express').Router();
const { authentication, restrictTo } = require('../controller/authController');
const { createProductImage, deleteProductImage } = require('../controller/productImageController');

router.post('/', authentication, restrictTo('1'), createProductImage);
router.delete('/:id', authentication, restrictTo('1'), deleteProductImage);
module.exports = router;
