'use strict';

const {  Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const stores = require('./stores');
const bcrypt = require('bcrypt');
const AppError = require('../../utils/appError');


const users = sequelize.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0','1','2'), //admin, seller, buyer
    allowNull: false,
    validate: {
      isIn: [['0','1','2']],
      notNull: {
        msg: 'User type is required'
      },
      notEmpty: {
        msg: 'User type cannot be empty'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First name is required'
      },
      notEmpty: {
        msg: 'First name cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Last name is required'
      },
      notEmpty: {
        msg: 'Last name cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email is required'
      },
      notEmpty: {
        msg: 'Email cannot be empty'
      },
      isEmail: {
        msg: 'Invalid email address'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required'
      },
      notEmpty: {
        msg: 'Password cannot be empty'
      },
      // len: {
      //   args: [8, 20],
      //   msg: 'Password must be between 8 and 20 characters'
      // },
      isStrongPassword: {
        msg: 'Password must be strong'
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if (value === this.password) {
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashPassword);
      } else {
        throw new AppError('Password and confirm password do not match', 400);
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
  },
  createdBy: {
    type: DataTypes.INTEGER
  },
  updatedBy: {
    type: DataTypes.INTEGER
  },
  deletedBy: {
    type: DataTypes.INTEGER
  }
}, {
  freezeTableName: true,
  modelName: 'users',
  timestamps: true,
  paranoid: true
});

users.hasMany(stores, {foreignKey: 'userId'});  
stores.belongsTo(users, {foreignKey: 'userId'});


module.exports = users;
