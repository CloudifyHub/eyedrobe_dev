const Subscription = require('../db/models/subscriptions');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const packages = require('../db/models/packages');

const createSubscription = catchAsync(async (req, res, next) => {
    // get user id from token
    const userId = req.user.id;

    if(!req.body.packageId){
      return next(new AppError('Package ID is required', 400));
    }

    // get package id from body
    const { packageId } = req.body;



    // check if package exists
    const packageResult = await packages.findOne({
      where: {
        id: packageId
      }
    });
    
    if (!packageResult) {
      return next(new AppError('Package not found', 404));
    }

    // check if user has already subscribed to this package
    const oldSubscription = await Subscription.findAndCountAll({
      where: {
        packageId,
        userId,
        status: 'active'
      }
    });

    if (oldSubscription.count > 0) {
      return next(new AppError(`User has already subscribed to ${oldSubscription.count} package`, 400));
    }

  const newSubscription = await Subscription.create({
    packageId,
    userId
  });

  const subscriptionResult = newSubscription.toJSON();
  delete subscriptionResult.packageId;
  delete subscriptionResult.userId;
  delete subscriptionResult.updatedAt;
  delete subscriptionResult.deletedAt;
  const fetchPackageResult = packageResult.toJSON();
  delete fetchPackageResult.createdAt;
  delete fetchPackageResult.updatedAt;
  delete fetchPackageResult.deletedAt;
  delete fetchPackageResult.id;

  return res.status(201).json({
    status: 'success',
    message: 'Subscription created successfully',
    data: {
      subscription: subscriptionResult,
      package: fetchPackageResult
    }
  });
});

module.exports = {
  createSubscription
}; 