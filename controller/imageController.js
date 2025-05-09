const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { products } = require('../db/models/products');
const productImages = require('../db/models/productImages');


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload image to cloudinary
const uploadImage = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'images',
        resource_type: 'auto'
    });

    // Get product id from params
    const productId = req.params.productId;

    const productRecord = await products.findOne({
        where: {
            id: productId
        }
    });

    // Check if product exists
    if (!productRecord) {
        return next(new AppError('Product not found', 404));
    }

    // Create product image
    const productImageRecord = await productImages.create({
        url: uploadResult.secure_url,
        productId: productId
    });



    if (!productImageRecord) {
        return next(new AppError('Failed to create product image', 400));
    }


    // Send response
    res.status(200).json({
        status: 'success',
        imageUrl: uploadResult.secure_url
    });
});

module.exports = { upload, uploadImage };
