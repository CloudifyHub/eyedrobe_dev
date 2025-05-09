const router = require('express').Router();
const { createPackage } = require('../controller/packageController');
const { authentication, restrictTo } = require('../controller/authController');

router.post('/', authentication, restrictTo('0'), createPackage);

module.exports = router;


