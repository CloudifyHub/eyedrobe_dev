const stores = require('../db/models/stores');
const users = require('../db/models/users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { products } = require('../db/models/products');
const  productImages  = require('../db/models/productImages');

//create a product
const createProduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;

    if(!body){
        return next(new AppError('No data provided', 400));
    }

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


const getProductById = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;

    const product = await products.findOne({
        where: {id: productId, userId: userId},
    });

    if(!product){
        return next(new AppError('Product not found', 404));
    }

    const productImagesUrls = await productImages.findAll({
        where: {productId: productId},
    });

    

    const productResult = product.toJSON();
    delete productResult.deletedAt;
    delete productResult.updatedAt;
    delete productResult.createdBy;
    delete productResult.userId;
    delete productResult.storeId;
    productResult.images = productImagesUrls.map(image => ({
        id: image.id,
        url: image.url
    }));

  


    return res.status(200).json({
        status: 'success',
        message: 'Product fetched successfully',
        data: productResult
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const body = req.body;

    if(!productId){
        return next(new AppError('Product ID is required', 400));
    }

    if(!body.productName || !body.description || !body.category || !body.brand || !body.sku || !body.price || !body.stock){
        return next(new AppError('All fields are required', 400));
    }

    const product = await products.findOne({
        where: {id: productId, userId: userId},
    });

    if(!product){
        return next(new AppError('Product not found', 404));
    }

    product.productName = body.productName;
    product.description = body.description;
    product.category = body.category;
    product.brand = body.brand;
    product.sku = body.sku;
    product.price = body.price;
    product.stock = body.stock;

    const updatedProduct = await product.save();

    if(!updatedProduct){
        return next(new AppError('Failed to update product', 400));
    }

    const productResult = updatedProduct.toJSON();
    delete productResult.deletedAt;
    delete productResult.createdAt;
    delete productResult.createdBy;
    delete productResult.userId;
    delete productResult.storeId;

    return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: productResult
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.params.id;

    if(!productId){
        return next(new AppError('Product ID is required', 400));
    }

    const product = await products.findOne({
        where: {id: productId, userId: userId},
    });

    if(!product){
        return next(new AppError('Product not found', 404));
    }

    await product.destroy();

    return res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
    });
});
module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
