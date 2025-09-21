        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Vacancies', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.TEXT, allowNull: false },
  description: { type: Sequelize.TEXT },
  location: { type: Sequelize.STRING },
  salary: { type: Sequelize.STRING },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Vacancys');
          }
        };
