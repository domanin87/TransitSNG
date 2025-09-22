'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tariffs', [
      { id:1, name_ru: 'Тариф A', name_kk: 'Тариф A', name_en: 'Tariff A', city: 'Almaty', price: 1000, starts_with: 'A', createdAt: new Date(), updatedAt: new Date() },
      { id:2, name_ru: 'Тариф B', name_kk: 'Тариф B', name_en: 'Tariff B', city: 'Astana', price: 1200, starts_with: 'A', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) { await queryInterface.bulkDelete('tariffs', null, {}); }
};
