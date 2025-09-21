        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('News', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.TEXT, allowNull: false },
  content: { type: Sequelize.TEXT },
  isPublished: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Newss');
          }
        };
