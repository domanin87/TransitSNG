'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { id: 1, name: 'Super Admin', email: 'super@local', password: 'password', is_superadmin: true, role: 'superadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Admin', email: 'admin@local', password: 'password', is_admin: true, role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Driver', email: 'driver@local', password: 'password', is_driver: true, role: 'driver', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Client', email: 'client@local', password: 'password', role: 'client', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
