'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cargos', {
      id:{ type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      user_id: { type: Sequelize.UUID },
      title: { type: Sequelize.STRING, allowNull:false },
      from_city: Sequelize.STRING,
      to_city: Sequelize.STRING,
      weight_kg: Sequelize.FLOAT,
      volume_m3: Sequelize.FLOAT,
      type: Sequelize.STRING,
      status: { type: Sequelize.STRING, defaultValue: 'published' },
      price: Sequelize.DECIMAL(12,2),
      published_at: Sequelize.DATE,
      createdAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') },
      updatedAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cargos');
  }
};
