module.exports = {
  development: {
    dialect: "postgres",
    host: "localhost",
    username: "postgres",
    password: "password",
    database: "transitsng_dev"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
