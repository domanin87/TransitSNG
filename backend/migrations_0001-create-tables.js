module.exports = {
  up: async (pgm) => {
    pgm.createTable('messages', {
      id: { type: 'SERIAL', primaryKey: true },
      user_id: { type: 'VARCHAR(50)', notNull: true },
      content: { type: 'TEXT', notNull: true },
      timestamp: { type: 'TIMESTAMP', notNull: true },
    });

    pgm.createTable('services', {
      id: { type: 'SERIAL', primaryKey: true },
      name: { type: 'VARCHAR(100)', notNull: true },
      description: { type: 'TEXT' },
      price: { type: 'DECIMAL(10,2)' },
    });

    pgm.createTable('tariffs', {
      id: { type: 'SERIAL', primaryKey: true },
      name: { type: 'VARCHAR(100)', notNull: true },
      rate: { type: 'DECIMAL(10,2)', notNull: true },
    });

    pgm.createTable('orders', {
      id: { type: 'SERIAL', primaryKey: true },
      customer_id: { type: 'VARCHAR(50)' },
      created_at: { type: 'TIMESTAMP', default: pgm.func('CURRENT_TIMESTAMP') },
    });

    pgm.createTable('users', {
      id: { type: 'VARCHAR(50)', primaryKey: true },
      name: { type: 'VARCHAR(100)' },
      email: { type: 'VARCHAR(100)' },
      phone: { type: 'VARCHAR(20)' },
    });

    pgm.createTable('drivers', {
      id: { type: 'SERIAL', primaryKey: true },
      name: { type: 'VARCHAR(100)' },
      license_number: { type: 'VARCHAR(50)' },
    });

    pgm.createTable('payments', {
      id: { type: 'SERIAL', primaryKey: true },
      order_id: { type: 'INTEGER', references: 'orders(id)' },
      amount: { type: 'DECIMAL(10,2)' },
    });

    pgm.createTable('customers', {
      id: { type: 'SERIAL', primaryKey: true },
      name: { type: 'VARCHAR(100)' },
      email: { type: 'VARCHAR(100)' },
      phone: { type: 'VARCHAR(20)' },
      company: { type: 'VARCHAR(100)' },
    });

    pgm.createTable('settings', {
      id: { type: 'SERIAL', primaryKey: true },
      site_name: { type: 'VARCHAR(100)' },
      currency: { type: 'VARCHAR(10)' },
      language: { type: 'VARCHAR(10)' },
    });

    pgm.createTable('verifications', {
      id: { type: 'SERIAL', primaryKey: true },
      user_id: { type: 'VARCHAR(50)' },
      type: { type: 'VARCHAR(50)' },
      status: { type: 'VARCHAR(20)' },
      submitted_at: { type: 'TIMESTAMP', default: pgm.func('CURRENT_TIMESTAMP') },
    });

    pgm.createTable('auth', {
      id: { type: 'SERIAL', primaryKey: true },
      user_id: { type: 'VARCHAR(50)', notNull: true },
      email: { type: 'VARCHAR(100)', notNull: true },
      password: { type: 'VARCHAR(100)', notNull: true },
      role: { type: 'VARCHAR(20)', notNull: true },
    });
  },
  down: async (pgm) => {
    pgm.dropTable('auth');
    pgm.dropTable('verifications');
    pgm.dropTable('settings');
    pgm.dropTable('customers');
    pgm.dropTable('payments');
    pgm.dropTable('drivers');
    pgm.dropTable('users');
    pgm.dropTable('orders');
    pgm.dropTable('tariffs');
    pgm.dropTable('services');
    pgm.dropTable('messages');
  },
};