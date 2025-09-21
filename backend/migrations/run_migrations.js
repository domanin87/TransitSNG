const { execSync } = require('child_process');
const path = require('path');

try {
  // Run node-pg-migrate
  console.log('Running node-pg-migrate...');
  execSync('npx node-pg-migrate up', { stdio: 'inherit' });

  // Run Sequelize migrations
  console.log('Running Sequelize migrations...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

  console.log('All migrations completed successfully');
} catch (err) {
  console.error('Migration error:', err.message);
  process.exit(1);
}