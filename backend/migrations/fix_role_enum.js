const { QueryTypes } = require('sequelize');
const { sequelize } = require('../src/models');

async function fixRoleEnum() {
  try {
    // Временно удаляем ограничения
    await sequelize.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" DROP NOT NULL,
      ALTER COLUMN "role" DROP DEFAULT;
    `, { type: QueryTypes.RAW });

    // Создаем временную колонку
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN "role_temp" VARCHAR(50);
    `, { type: QueryTypes.RAW });

    // Копируем данные во временную колонку
    await sequelize.query(`
      UPDATE "users" 
      SET "role_temp" = "role";
    `, { type: QueryTypes.RAW });

    // Удаляем оригинальную колонку
    await sequelize.query(`
      ALTER TABLE "users" 
      DROP COLUMN "role";
    `, { type: QueryTypes.RAW });

    // Создаем ENUM тип
    await sequelize.query(`
      DO $$ 
      BEGIN 
        CREATE TYPE "user_role_enum" AS ENUM ('user', 'carrier', 'moderator', 'accountant', 'admin', 'superadmin');
      EXCEPTION 
        WHEN duplicate_object THEN null;
      END $$;
    `, { type: QueryTypes.RAW });

    // Создаем новую колонку с правильным типом
    await sequelize.query(`
      ALTER TABLE "users" 
      ADD COLUMN "role" "user_role_enum" DEFAULT 'user' NOT NULL;
    `, { type: QueryTypes.RAW });

    // Копируем данные обратно
    await sequelize.query(`
      UPDATE "users" 
      SET "role" = "role_temp"::"user_role_enum";
    `, { type: QueryTypes.RAW });

    // Удаляем временную колонку
    await sequelize.query(`
      ALTER TABLE "users" 
      DROP COLUMN "role_temp";
    `, { type: QueryTypes.RAW });

    console.log('✅ Role enum migration completed successfully!');
  } catch (error) {
    console.error('❌ Error in role enum migration:', error);
    throw error;
  }
}

if (require.main === module) {
  fixRoleEnum()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = fixRoleEnum;