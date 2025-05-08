const users = require('../db/models/users');
const stores = require('../db/models/stores');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Basic Auth credentials
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

const basicAuth = catchAsync(async (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return next(new AppError('Basic authentication required', 401));
    }

    // Get the base64 encoded credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check credentials
    if (username !== BASIC_AUTH_USERNAME || password !== BASIC_AUTH_PASSWORD) {
        return next(new AppError('Invalid credentials', 401));
    }

    // If credentials are valid, proceed
    return next();
});

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

//signup
const signup = catchAsync(async (req, res, next) => {

    const body = req.body;

    //validate the request body
    if(!body.email || !body.password || !body.firstName || !body.lastName || !body.userType || !body.confirmPassword){
        return next(new AppError('All fields are required', 400));
    }

    if(!['0','1','2'].includes(body.userType)){
        return next(new AppError('Invalid user type', 400));
    }
    
    //save to db
    const newUser = await users.create({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        userType: body.userType,
        confirmPassword: body.confirmPassword
    });

    //check if user is created
    if(!newUser){
        return next(new AppError('Failed to create user', 400));
    }

    //generate token
    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.deletedBy;
    delete result.createdBy;
    delete result.updatedBy;


    result.token = generateToken({
        id: result.id,
    });

    if(!result){
        return next(new AppError('Failed to generate user token', 400));
    }
    
    //return success response
    return res.status(200).json({
        status: 'success',
        message: 'Signup successfully',
        data: result
    });
});


//login
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
   console.log(email, password);

    //validate the request body
    if(!email || !password){
        return next(new AppError('All fields are required', 400));
    }

    //check if user exists
    const user = await users.findOne({
        where: {
            email: email
        }
    });

    if(!user){
        return next(new AppError('User not found', 400));
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        return next(new AppError('Invalid email or password', 400));
    }

        //generate token
    const token = generateToken({
        id: user.id,
    });

    //remove the password from the result
    const newResult = user.toJSON();
    delete newResult.password;
    delete newResult.deletedAt;
    delete newResult.updatedAt;
    delete newResult.deletedBy;
    delete newResult.createdBy;
    delete newResult.updatedBy;
    delete newResult.createdAt;
    delete newResult.updatedAt;
    delete newResult.deletedAt;
    delete newResult.deletedBy;
    delete newResult.createdBy;
    delete newResult.updatedBy;

    const store = await stores.findOne({
        where: {
            userId: user.id
        }
    });

    if(!store){
        newResult.store = 'no store found';
    }

    if(store){
       const storeResult = store.toJSON();
       delete storeResult.deletedAt;
       delete storeResult.updatedAt;
       delete storeResult.deletedBy;
       delete storeResult.createdBy;
       delete storeResult.updatedBy;
       delete storeResult.userId;
       newResult.store = storeResult;
    }


    //return success response
    return res.status(200).json({
        status: 'success',
        message: 'Login successfully',
        data: newResult,
        token: token
    });
}); 

//authentication
const authentication = catchAsync(async (req, res, next) => {

    //get the token from the header
    let token = '';

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('Unauthorized, Login to get access', 401));
    }



    //verify the token
    const tokenDetail = jwt.verify(token, process.env.JWT_SECRET);

    //get the user from the database
    const freshUser = await users.findByPk(tokenDetail.id);

    //if the user is not found, return a 401 error
    if(!freshUser){
        return next(new AppError('User not found', 401));
    }

    //add the user to the request
    req.user = freshUser;
    return next();
    
    
    
});

// restrict to user types
const restrictTo = (...userTypes) => {
    const checkPermission = (req, res, next) => {
        if(!userTypes.includes(req.user.userType)){
            return next(new AppError('You are not authorized to access this resource', 403));
        }
        return next();
    }
    return checkPermission;
}




module.exports = { 
    signup, 
    login, 
    authentication, 
    restrictTo, 
    basicAuth 
};
