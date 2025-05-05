const router = require('express').Router();
const { authentication, restrictTo } = require('../controller/authController');
const { createStore, getAllStores, getStoreById, updateStore, deleteStore } = require('../controller/storeController');


router.post('/', authentication, restrictTo('1'), createStore);
router.get('/', authentication, restrictTo('1'), getAllStores);
router.get('/:id', authentication, restrictTo('1'), getStoreById);
router.patch('/:id', authentication, restrictTo('1'), updateStore);
router.delete('/:id', authentication, restrictTo('1'), deleteStore);

module.exports = router;
