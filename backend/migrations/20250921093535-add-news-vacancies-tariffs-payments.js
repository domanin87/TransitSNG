'use strict';
/** Migration: add news, vacancies, tariffs, payments tables */
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
    await queryInterface.createTable('Tariffs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING },
      price: { type: Sequelize.DECIMAL(12,2) },
      startsWith: { type: Sequelize.STRING(1) },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
    });
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
    await queryInterface.dropTable('Tariffs');
    await queryInterface.dropTable('Vacancies');
    await queryInterface.dropTable('News');
  }
};
