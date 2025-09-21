const { execSync } = require('child_process');

try {
  // Очистка блокировки перед запуском миграций
  console.log('Проверка и очистка блокировки миграции...');
  execSync('psql $DATABASE_URL -c "DELETE FROM pgmigrations WHERE name = \'lock\'"', { stdio: 'inherit' });

  // Запуск миграций node-pg-migrate
  console.log('Запуск node-pg-migrate...');
  execSync('npx node-pg-migrate up', { stdio: 'inherit' });

  // Запуск миграций Sequelize
  console.log('Запуск миграций Sequelize...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

  console.log('Все миграции успешно завершены');
} catch (err) {
  console.error('Ошибка миграции:', err.message);
  process.exit(1);
}