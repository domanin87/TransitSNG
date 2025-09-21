        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Payments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: Sequelize.INTEGER },
  amount: { type: Sequelize.DECIMAL(12,2) },
  currency: { type: Sequelize.STRING },
  status: { type: Sequelize.STRING },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Payments');
          }
        };
