const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];


const sequelize = new Sequelize(config);

module.exports = {
    sequelize
};