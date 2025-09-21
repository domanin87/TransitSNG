'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('Services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
    });

    await queryInterface.createTable('Tariffs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });

    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: Sequelize.STRING(50),
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
    });

    await queryInterface.createTable('Drivers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      license_number: {
        type: Sequelize.STRING(50),
      },
    });

    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
    });

    await queryInterface.createTable('Customers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      company: {
        type: Sequelize.STRING(100),
      },
    });

    await queryInterface.createTable('Settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      site_name: {
        type: Sequelize.STRING(100),
      },
      currency: {
        type: Sequelize.STRING(10),
      },
      language: {
        type: Sequelize.STRING(10),
      },
    });

    await queryInterface.createTable('Verifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(50),
      },
      type: {
        type: Sequelize.STRING(50),
      },
      status: {
        type: Sequelize.STRING(20),
      },
      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.createTable('Auths', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Auths');
    await queryInterface.dropTable('Verifications');
    await queryInterface.dropTable('Settings');
    await queryInterface.dropTable('Customers');
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('Drivers');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Orders');
    await queryInterface.dropTable('Tariffs');
    await queryInterface.dropTable('Services');
    await queryInterface.dropTable('Messages');
  },
};