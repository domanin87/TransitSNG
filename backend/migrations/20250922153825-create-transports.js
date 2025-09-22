'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transports', {
      id:{ type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      user_id: { type: Sequelize.UUID },
      title: Sequelize.STRING,
      city: Sequelize.STRING,
      capacity_kg: Sequelize.FLOAT,
      body_type: Sequelize.STRING,
      status: { type: Sequelize.STRING, defaultValue: 'available' },
      createdAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') },
      updatedAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transports');
  }
};
