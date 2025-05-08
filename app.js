require('dotenv').config({ path: `${process.cwd()}/.env` });

const express = require('express');
const app = express();
const cors = require('cors');
const authRoute = require('./route/authRoute');
const storeRoute = require('./route/storeRoute');
const productRoute = require('./route/productRoute');
const productImageRoute = require('./route/productImageRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/store', storeRoute);
app.use('/api/v1/product', productRoute);   
app.use('/api/v1/product-image', productImageRoute);

// 404 handler for undefined routes
app.use('', catchAsync(async (req, res, next) => {
    throw new AppError('This route is not defined', 404);
}));

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

