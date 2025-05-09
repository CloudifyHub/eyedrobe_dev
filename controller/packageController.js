const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const packages = require('../db/models/packages');



const createPackage = catchAsync(async (req, res, next) => {
    const body = req.body;

    console.log(body);
    console.log(body.packageName);
    console.log(body.description);
    console.log(body.price);
    console.log(body.duration);
    console.log(body.discount);


    if(!body){
        return next(new AppError('No data provided', 400));
    }

    if(!body.packageName ){
        return next(new AppError('Package name is required', 400));
    }

    if(!body.description){
        return next(new AppError('Description is required', 400));
    }


    if(body.price < 0){
        return next(new AppError('Price cannot be negative', 400));
    }


    if(body.discount < 0){
        return next(new AppError('Discount cannot be negative', 400));
    }

    const newPackage = await packages.create({
        packageName: body.packageName, 
        description: body.description, 
        price: body.price, 
        duration: body.duration, 
        discount: body.discount 
    });

    const packageResult = newPackage.toJSON();
    delete packageResult.deletedAt;
    delete packageResult.updatedAt;


    res.status(201).json({
        status: 'success',
        message: 'Package created successfully',
        data: packageResult
    });
});



module.exports = {
    createPackage
};