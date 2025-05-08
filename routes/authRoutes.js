const express = require('express');
const router = express.Router();
const { signup, login, basicAuth } = require('../controller/authController');

// Apply basicAuth middleware to login and signup routes
router.post('/signup', basicAuth, signup);
router.post('/login', basicAuth, login);

module.exports = router; 