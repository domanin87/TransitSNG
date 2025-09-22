'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query("DROP EXTENSION IF EXISTS pgcrypto;");
  }
};
