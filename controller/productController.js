const stores = require('../db/models/stores');
const users = require('../db/models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { products } = require('../db/models/products');

//create a product
const createProduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;

    if(!body.productName || !body.description || !body.category || !body.brand || !body.sku || !body.price || !body.stock || !body.storeId){
        return next(new AppError('All fields are required', 400));
    }

    const user = await users.findOne({
        where: {id: userId},
    });

    if(!user){
        return next(new AppError('User not found', 404));
    }

    const store = await stores.findOne({
        where: {id: body.storeId},
    });

    if(!store){
        return next(new AppError('Store not found', 404));
    }


    const product = await products.create({
        userId: userId,
        storeId: body.storeId,
        productName: body.productName,
        description: body.description,
        category: body.category,
        brand: body.brand,
        sku: body.sku,
        price: body.price,
        stock: body.stock,
        createdBy: userId
    });

    const productResult = product.toJSON();
    delete productResult.deletedAt;
    delete productResult.updatedAt;
    delete productResult.createdBy;
    delete productResult.userId;
    delete productResult.storeId;

    res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: productResult
    });
});


const getAllProducts = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const userProducts = await products.findAll({
        where: {
            userId: userId,
        },
    }); 

    if(!userProducts){
        return next(new AppError('No products found', 404));
    }


   const productResults = userProducts.map(product => {
        const productResult = product.toJSON();
        delete productResult.deletedAt;
        delete productResult.updatedAt;
        delete productResult.createdBy;
        delete productResult.userId;
        delete productResult.storeId;
        return productResult;
    });

    return res.status(200).json({
        status: 'success',
        message: 'Products fetched successfully',
        data: productResults
    });
});

module.exports = { createProduct, getAllProducts };