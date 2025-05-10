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


const getSubscription = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const allSubscription = await Subscription.findAndCountAll({
    where: { userId },
    include: [packages]
  });

  if (allSubscription.count === 0) {
    return next(new AppError('No subscription found', 404));
  }

  //map through all subscription and return the subscription and package
  const subscriptionResult = allSubscription.rows.map(subscription => {
    const subscriptionData = subscription.toJSON();
    delete subscriptionData.packageId;
    delete subscriptionData.userId;
    delete subscriptionData.updatedAt;
    delete subscriptionData.deletedAt;
    delete subscriptionData.package.createdAt;
    delete subscriptionData.package.updatedAt;
    delete subscriptionData.package.deletedAt;
    delete subscriptionData.package.id;

    return {
      subscription: subscriptionData
    }
  });


  return res.status(200).json({
    status: 'success',
    data: subscriptionResult

  });
});


//update subscription
const updateSubscription = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const subscriptionId = req.params.id;

  //get package id, status, start date, end date from body
  const { packageId, status, startDate, endDate } = req.body;

  
  if(!packageId){
    return next(new AppError('Package ID is required', 400));
  }

  if(!status){
    return next(new AppError('Status is required', 400));
  }

  if(!startDate){
    return next(new AppError('Start date is required', 400));
  } 

  if(!endDate){
    return next(new AppError('End date is required', 400));
  }

  const packageResult = await packages.findOne({
    where: { id: packageId }
  });

  if(!packageResult){
    return next(new AppError('Package not found', 404));
  }

  const subscription = await Subscription.findOne({
    where: { id: subscriptionId, userId: userId }
  });

  if (!subscription) {
    return next(new AppError('Subscription not found', 404));
  }

  subscription.packageId = packageId;
  subscription.status = status;
  subscription.startDate = startDate;
  subscription.endDate = endDate;

  const updatedSubscription = await subscription.save();

  if(!updatedSubscription){
    return next(new AppError('Failed to update subscription', 400));
  }

  return res.status(200).json({
    status: 'success',
    message: 'Subscription updated successfully',
    data: updatedSubscription
  });
});
  

//delete subscription
const deleteSubscription = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const subscriptionId = req.params.id;
  
  const subscription = await Subscription.findOne({
    where: { id: subscriptionId, userId: userId }
  });

  if(!subscription){
    return next(new AppError('Subscription not found', 404));
  }

  if(subscription.status === 'active'){
    return next(new AppError('Subscription is active, please cancel the subscription first', 400));
  }

  await subscription.destroy();

  return res.status(200).json({
    status: 'success',
    message: 'Subscription deleted successfully'
  });
});

module.exports = {
  createSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription
}; 