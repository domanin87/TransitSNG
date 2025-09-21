        'use strict';
        module.exports = {
          up: async (queryInterface, Sequelize) => {
            await queryInterface.createTable('Users', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  phone: { type: Sequelize.STRING },
  role: { type: Sequelize.ENUM('user','moderator','admin','superadmin'), defaultValue: 'user' },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
  isDriver: { type: Sequelize.BOOLEAN, defaultValue: false },
  isAdmin: { type: Sequelize.BOOLEAN, defaultValue: false },
  isSuperAdmin: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
});

          },
          down: async (queryInterface, Sequelize) => {
            await queryInterface.dropTable('Users');
          }
        };
