import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

async function migrate() {
  try {
    // пример создания таблиц
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        origin VARCHAR(255),
        destination VARCHAR(255),
        cargo_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Миграции успешно применены!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ошибка миграций:", err);
    process.exit(1);
  }
}

migrate();
