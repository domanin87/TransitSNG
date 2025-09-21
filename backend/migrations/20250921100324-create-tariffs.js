        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Tariffs', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  price: { type: Sequelize.DECIMAL(12,2) },
  startsWith: { type: Sequelize.STRING(1) },
  active: { type: Sequelize.BOOLEAN, defaultValue: true },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Tariffs');
          }
        };
