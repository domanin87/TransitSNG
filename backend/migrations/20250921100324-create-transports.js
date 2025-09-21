        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Transports', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  fromCity: { type: Sequelize.STRING },
  toCity: { type: Sequelize.STRING },
  capacity: { type: Sequelize.FLOAT },
  vehicleType: { type: Sequelize.STRING },
  licensePlate: { type: Sequelize.STRING },
  driverName: { type: Sequelize.STRING },
  contactPhone: { type: Sequelize.STRING },
  availableFrom: { type: Sequelize.DATE },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Transports');
          }
        };
