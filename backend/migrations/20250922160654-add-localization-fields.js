'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    // news localized
    await queryInterface.addColumn('news', 'title_ru', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('news', 'title_kk', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('news', 'title_en', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('news', 'content_ru', { type: Sequelize.TEXT }).catch(()=>{});
    await queryInterface.addColumn('news', 'content_kk', { type: Sequelize.TEXT }).catch(()=>{});
    await queryInterface.addColumn('news', 'content_en', { type: Sequelize.TEXT }).catch(()=>{});
    // vacancies localized
    await queryInterface.addColumn('vacancies', 'title_ru', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('vacancies', 'title_kk', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('vacancies', 'title_en', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('vacancies', 'description_ru', { type: Sequelize.TEXT }).catch(()=>{});
    await queryInterface.addColumn('vacancies', 'description_kk', { type: Sequelize.TEXT }).catch(()=>{});
    await queryInterface.addColumn('vacancies', 'description_en', { type: Sequelize.TEXT }).catch(()=>{});
    // tariffs localized
    await queryInterface.addColumn('tariffs', 'name_ru', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('tariffs', 'name_kk', { type: Sequelize.STRING }).catch(()=>{});
    await queryInterface.addColumn('tariffs', 'name_en', { type: Sequelize.STRING }).catch(()=>{});
  },

  async down (queryInterface, Sequelize) {
    // down - try to remove if exists
    await queryInterface.removeColumn('news', 'title_ru').catch(()=>{});
    await queryInterface.removeColumn('news', 'title_kk').catch(()=>{});
    await queryInterface.removeColumn('news', 'title_en').catch(()=>{});
    await queryInterface.removeColumn('news', 'content_ru').catch(()=>{});
    await queryInterface.removeColumn('news', 'content_kk').catch(()=>{});
    await queryInterface.removeColumn('news', 'content_en').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'title_ru').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'title_kk').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'title_en').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'description_ru').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'description_kk').catch(()=>{});
    await queryInterface.removeColumn('vacancies', 'description_en').catch(()=>{});
    await queryInterface.removeColumn('tariffs', 'name_ru').catch(()=>{});
    await queryInterface.removeColumn('tariffs', 'name_kk').catch(()=>{});
    await queryInterface.removeColumn('tariffs', 'name_en').catch(()=>{});
  }
};
