        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Cargos', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  fromCity: { type: Sequelize.STRING },
  toCity: { type: Sequelize.STRING },
  weight: { type: Sequelize.FLOAT },
  volume: { type: Sequelize.FLOAT },
  type: { type: Sequelize.STRING },
  price: { type: Sequelize.DECIMAL(12,2) },
  description: { type: Sequelize.TEXT },
  loadingDate: { type: Sequelize.DATE },
  contactPhone: { type: Sequelize.STRING },
  status: { type: Sequelize.ENUM('pending','published','archived'), defaultValue: 'pending' },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Cargos');
          }
        };
