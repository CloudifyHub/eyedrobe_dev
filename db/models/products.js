'use strict';

const {  Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const users = require('./users');
const stores = require('./stores');


const products = sequelize.define('products', {
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
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Product name is required'
      },
      notEmpty: {
        msg: 'Product name cannot be empty'
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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
          msg: 'Category is required'
      },
      notEmpty: {
        msg: 'Category cannot be empty'
      }
    }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Brand is required'
      },
      notEmpty: {
        msg: 'Brand cannot be empty'
      }
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'SKU is required'
      },
      notEmpty: {
        msg: 'SKU cannot be empty'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Price is required'
      },
      isDecimal: {
        msg: 'Price must be a number'
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notNull: {
        msg: 'Status is required'
      }
    },
    isIn: {
      args: [[true, false]],
      msg: 'Invalid status'
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Stock must be an integer'
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
  modelName: 'products',
  timestamps: true,
  paranoid: true
});

// Define associations after all models are loaded
const defineAssociations = (models) => {
  products.belongsTo(models.users, { foreignKey: 'userId' });
  models.stores.hasMany(products, { foreignKey: 'storeId' });
  products.hasMany(models.product_images, { foreignKey: 'product_id' });
};

module.exports = { products, defineAssociations };