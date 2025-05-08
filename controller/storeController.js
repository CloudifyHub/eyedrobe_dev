const stores = require('../db/models/stores');
const users = require('../db/models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


//create a store
const createStore = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    
    if(!body.name || !body.location || !body.status || !body.description || !body.image){
        return next(new AppError('All fields are required', 400));
    }

    const user = await users.findOne({
        where: {id: userId},
        include: [stores]
    });

    if(!user){
        return next(new AppError('User not found', 404));
    }

    if(user.stores && user.stores.length > 0){
        return next(new AppError('User already has a store', 400));
    }

    const newStore = await stores.create({
        userId: userId,
        name: body.name,
        location: body.location,
        status: body.status,
        description: body.description,
        image: body.image,
        createdBy: userId
    });

    if(!newStore){
        return next(new AppError('Failed to create store', 400));
    }

    return res.status(201).json({
        status: 'success',
        message: 'Store created successfully',
        data: newStore
    });
});

//get all stores
const getAllStores = catchAsync(async (req, res, next) => {
    const result = await stores.findAll({
        include: [users],
        where: {userId: req.user.id}
    });

    if(!result){
        return next(new AppError('No stores found', 404));
    }


    const storeResults = result.map(store => {
        const storeResult = store.toJSON();

        //delete store fields
        delete storeResult.deletedAt;
        delete storeResult.updatedAt;
        delete storeResult.createdBy;
        delete storeResult.userId;

        //delete user fields
        delete storeResult.user.id;
        delete storeResult.user.email;
        delete storeResult.user.password;
        delete storeResult.user.role;
        delete storeResult.user.createdBy;
        delete storeResult.user.updatedBy;
        delete storeResult.user.deletedBy;
        delete storeResult.user.deletedAt;

        return storeResult;
    });

    return res.status(200).json({
        status: 'success',
        message: 'Stores fetched successfully',
        data: storeResults
    });
});

  
const getStoreById = catchAsync(async (req, res, next) => {
    const storeId = req.params.id;
    const result  = await stores.findByPk(storeId);

    if(!result){
        return next(new AppError('Store not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: result
    });
});


const updateStore = catchAsync(async (req, res, next) => {
    const storeId = req.params.id;
    const body = req.body;

    if(!storeId){
        return next(new AppError('Store ID is required', 400));
    }

    if(!body.name || !body.location || !body.status || !body.description || !body.image){
        return next(new AppError('All fields are required', 400));
    }

    const result = await stores.findOne({where: {id: storeId, userId: req.user.id}});

    if(!result){
        return next(new AppError('Store not found', 404));
    }

    result.name = body.name;
    result.location = body.location;
    result.status = body.status;
    result.description = body.description;
    result.image = body.image;

    
    const updatedStore = await result.save();

    if(!updatedStore){
        return next(new AppError('Failed to update store', 400));
    }

    return res.status(200).json({
        status: 'success',
        message: 'Store updated successfully',
        data: updatedStore
    });
});


//delete a store
const deleteStore = catchAsync(async (req, res, next) => {
    const storeId = req.params.id;
    const result = await stores.findByPk(storeId);

    if(!result){
        return next(new AppError('Store not found', 404));
    }

    await result.destroy();
    
    return res.status(200).json({
        status: 'success',
        message: 'Store deleted successfully'
    });
});

module.exports = { createStore, getAllStores, getStoreById, updateStore, deleteStore }