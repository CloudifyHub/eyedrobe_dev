const express = require('express');
const router = express.Router();
const { createSubscription, getSubscription, updateSubscription, deleteSubscription } = require('../controller/SubscriptionController');
const { authentication, restrictTo } = require('../controller/authController');


router.post('/', authentication, restrictTo('1'), createSubscription);
router.get('/', authentication, restrictTo('1'), getSubscription);
router.patch('/:id', authentication, restrictTo('1'), updateSubscription);
router.delete('/:id', authentication, restrictTo('1'), deleteSubscription);
module.exports = router;