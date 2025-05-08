'use strict';

const {  Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');
const { users } = require('./users');

const stores = sequelize.define('stores', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Store name is required'
      },
      notEmpty: {
        msg: 'Store name cannot be empty'
      }
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Location is required'
      },
      notEmpty: {
        msg: 'Location cannot be empty'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('0','1'), //0: inactive, 1: active
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Status is required'
      },
      notEmpty: {
        msg: 'Status cannot be empty'
      },
      isIn: {
        args: [['0','1']],
        msg: 'Invalid status'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
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
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Image is required'
      },
      notEmpty: {
        msg: 'Image cannot be empty'
      },
      isUrl: {
        msg: 'Invalid image URL'
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
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Created by is required'
      },
      notEmpty: {
        msg: 'Created by cannot be empty'
      }
    }
  },
  deletedAt: {
    type : DataTypes.DATE
  }
}, {
  freezeTableName: true,
  modelName: 'stores',
  timestamps: true,
  paranoid: true
});


module.exports = stores;