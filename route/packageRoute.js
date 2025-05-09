const router = require('express').Router();
const { createPackage, getPackages, getPackageById, updatePackage, deletePackage } = require('../controller/packageController');
const { authentication, restrictTo } = require('../controller/authController');

router.post('/', authentication, restrictTo('0'), createPackage);
router.get('/', getPackages);
router.get('/:id', getPackageById);
router.patch('/:id', authentication, restrictTo('0'), updatePackage);
router.delete('/:id', authentication, restrictTo('0'), deletePackage);
module.exports = router;


