const mysql = require("mysql2");
require("dotenv").config();

let dbConfig;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);

  dbConfig = {
    host: dbUrl.hostname,
    port: Number(dbUrl.port),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace("/", ""),
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

console.log("DB_HOST:", dbConfig.host);
console.log("DB_PORT:", dbConfig.port);
console.log("DB_USER:", dbConfig.user);
console.log("DB_NAME:", dbConfig.database);

const db = mysql.createPool({
  ...dbConfig,

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,

  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

db.getConnection((error, connection) => {
  if (error) {
    console.log("MySQL connection failed:", error.message);
    return;
  }

  console.log("MySQL connected successfully");
  connection.release();
});

module.exports = db;