const { Sequelize } = require("sequelize");
require("dotenv").config();
const options = { logging: false, pool: { max: 5, min: 0, acquire: 30000, idle: 10000 } };
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...options, dialect: "postgres",
    ...(process.env.DB_SSL === "true" ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: true } } } : {}),
  });
} else if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL, { ...options, dialect: "mysql" });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "blogpost_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    { ...options, host: process.env.DB_HOST || "localhost", port: Number(process.env.DB_PORT || 3306), dialect: "mysql" }
  );
}
module.exports = sequelize;