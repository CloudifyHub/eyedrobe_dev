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


const getPackages = catchAsync(async (req, res, next) => {
        const allPackages = await packages.findAll();

        if(!allPackages){
            return next(new AppError('No packages found', 404));
        }

        if(allPackages.length === 0){
            return next(new AppError('No packages found', 404));
        }

        const packageResult = allPackages.map(package => {
            const allPackage = package.toJSON();
            delete allPackage.deletedAt;
            delete allPackage.updatedAt;
            return allPackage;
        });



        res.status(200).json({
            status: 'success',
            message: 'Packages fetched successfully',
            data: packageResult
        });
});

const getPackageById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const package = await packages.findByPk(id);
    
    if(!package){
        return next(new AppError('Package not found', 404));
    }

    const packageResult = package.toJSON();
    delete packageResult.deletedAt;
    delete packageResult.updatedAt;

    res.status(200).json({
        status: 'success',
        message: 'Package fetched successfully',
        data: packageResult
    });

});

const updatePackage = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { packageName, description, price, duration, discount } = req.body;
    const package = await packages.findByPk(id);

    if(!package){
        return next(new AppError('Package not found', 404));
    }

    const updatedPackage = await package.update({
        packageName, description, price, duration, discount
    });

    if(!updatedPackage){
        return next(new AppError('Package not updated', 400));
    }

    const packageResult = updatedPackage.toJSON();
    delete packageResult.deletedAt;
    delete packageResult.updatedAt;

    res.status(200).json({
        status: 'success',
        message: 'Package updated successfully',
        data: packageResult
    });
});

const deletePackage = catchAsync(async (req, res, next) => {``
    const { id } = req.params;
    const package = await packages.findByPk(id);
    
    if(!package){
        return next(new AppError('Package not found', 404));
    }

    await package.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Package deleted successfully'
    });
    
    

});

module.exports = {
    createPackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage
};