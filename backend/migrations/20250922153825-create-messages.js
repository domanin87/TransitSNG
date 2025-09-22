'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id:{ type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      chat_id: Sequelize.STRING,
      from_user: Sequelize.UUID,
      to_user: Sequelize.UUID,
      text: Sequelize.TEXT,
      read: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') },
      updatedAt: { type: Sequelize.DATE, allowNull:false, defaultValue: Sequelize.literal('now()') }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};
