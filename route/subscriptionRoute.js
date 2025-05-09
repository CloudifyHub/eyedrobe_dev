const express = require('express');
const router = express.Router();
const { createSubscription } = require('../controller/SubscriptionController');
const { authentication, restrictTo } = require('../controller/authController');


router.post('/create-subscription', authentication, restrictTo('1'), createSubscription);

module.exports = router;