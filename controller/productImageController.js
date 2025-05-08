const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const productImages = require('../db/models/product_images');
const { products } = require('../db/models/products');


const createProductImage = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.user.id;
    if(!body.product_id){
        return next(new AppError('Product ID is required', 400));
    }

    if(!body.url){
        return next(new AppError('URL is required', 400));
    }

    const oldProduct = await products.findOne({
        where: {id: body.product_id, userId: userId},
    });

    if(!oldProduct){
        return next(new AppError('Product not found', 404));
    }

    const productImagesCount = await productImages.count({
        where: {productId: body.product_id},
    });

    if(productImagesCount >= 3){
        return next(new AppError('You can include at most 3 images for a product', 400));
    }
    
    const newProductImage = await productImages.create({
        productId: body.product_id,
        url: body.url,
    });

    const productImageResult = newProductImage.toJSON();
    delete productImageResult.deletedAt;
    delete productImageResult.updatedAt;
    delete productImageResult.productId;


    return res.status(201).json({
        status: 'success',
        message: 'Product image created successfully',
        data: productImageResult,
    });
});


const deleteProductImage = catchAsync(async (req, res, next) => {
    const productImageId = req.params.id;
   
    if(!productImageId){
        return next(new AppError('Product image ID is required', 400));
    }

    const productImage = await productImages.findOne({
        where: {id: productImageId},
    });

    if(!productImage){
        return next(new AppError('Product image not found', 404));
    }   


    return res.status(200).json({
        status: 'success',
        message: 'Product image deleted successfully',
    });
});

module.exports = { createProductImage, deleteProductImage };
