'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      packageName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Package name is required'
          }
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Description is required'
          }
        }
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Price is required'
          }
        }
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Duration is required'
          }
        }
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Discount is required'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('packages');
  }
};