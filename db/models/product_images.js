'use strict';

const {  Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');
const { products } = require('./products');

const productImages = sequelize.define('product_images', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true,
  modelName: 'product_images',
  timestamps: true,
  paranoid: true
});

module.exports = productImages;