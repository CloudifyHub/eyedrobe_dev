'use strict';

const {  Model, DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../../config/database');
const packages = require('./packages');
const users = require('./users');

const subscriptions = sequelize.define('subscriptions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'packages',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      notNull: {
        msg: 'Status is required'
      },
      notEmpty: {
        msg: 'Status cannot be empty'
      }
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP + INTERVAL \'30 days\'')
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
  modelName: 'subscriptions',
  timestamps: true,
  paranoid: true
});

subscriptions.belongsTo(packages, { foreignKey: 'packageId' });
subscriptions.belongsTo(users, { foreignKey: 'userId' });

module.exports = subscriptions;