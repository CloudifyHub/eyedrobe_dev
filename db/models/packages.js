'use strict';

const {  Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');


const packages = sequelize.define('packages', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Package name is required'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Description is required'
      },
      notEmpty: {
        msg: 'Description cannot be empty'
      }
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      notNull: {
        msg: 'Price is required'
      },
      notEmpty: {
        msg: 'Price cannot be empty'
      }
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      notNull: {
        msg: 'Duration is required'
      },
      notEmpty: {
        msg: 'Duration cannot be empty'
      }
    }
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      notNull: {
        msg: 'Discount is required'
      },
      notEmpty: {
        msg: 'Discount cannot be empty'
      }
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
    type : DataTypes.DATE
  }
}, {
  freezeTableName: true,
  modelName: 'packages',
  timestamps: true,
  paranoid: true
});


module.exports = packages;