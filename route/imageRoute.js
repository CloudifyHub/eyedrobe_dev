const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controller/imageController');
const { authentication, restrictTo } = require('../controller/authController');


// router.post('/upload', authentication, restrictTo('1'), upload.single('image'), uploadImage);

router.post('/upload/:productId', authentication, restrictTo('1'), upload.single('image'), uploadImage);

module.exports = router;