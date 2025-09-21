        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Orders', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: Sequelize.UUID },
  driverId: { type: Sequelize.UUID },
  cargoId: { type: Sequelize.INTEGER },
  status: { type: Sequelize.ENUM('new','accepted','in_transit','completed','archived'), defaultValue: 'new' },
  price: { type: Sequelize.DECIMAL(12,2) },
  archived: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Orders');
          }
        };
