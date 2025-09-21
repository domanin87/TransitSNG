require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Логируем URL базы (для проверки)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error connecting to database:", err);
  });

// Пример роутов
app.get("/", (req, res) => {
  res.send("TransitSNG API is running 🚀");
});
