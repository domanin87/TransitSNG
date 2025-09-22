'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cargos', [
      { id:1, user_id: 4, title: 'Фура до Астаны', from_city: 'Almaty', to_city: 'Astana', weight_kg: 10000, type: 'General', status: 'published', price: 5000, published_at: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { id:2, user_id: 4, title: 'Контейнер 20ft', from_city: 'Shymkent', to_city: 'Almaty', weight_kg: 20000, type: 'Container', status: 'published', price: 8000, published_at: new Date(), createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) { await queryInterface.bulkDelete('cargos', null, {}); }
};
