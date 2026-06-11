const mysql = require("mysql2");
require("dotenv").config();

const DEFAULT_PORT = 3306;

function parseConnectionUrl(databaseUrl) {
  const dbUrl = new URL(databaseUrl);
  return {
    host: dbUrl.hostname,
    port: dbUrl.port ? Number(dbUrl.port) : DEFAULT_PORT,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ""),
  };
}

function getRailwayConfig() {
  const host = process.env.MYSQLHOST || process.env.MYSQL_HOST;
  const port = process.env.MYSQLPORT || process.env.MYSQL_PORT;
  const user = process.env.MYSQLUSER || process.env.MYSQL_USER;
  const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE;

  if (host || port || user || password || database) {
    return {
      host,
      port: port ? Number(port) : DEFAULT_PORT,
      user,
      password,
      database,
    };
  }

  return null;
}

let dbConfig;
let configSource = "DB_* variables";

if (process.env.DATABASE_URL) {
  dbConfig = parseConnectionUrl(process.env.DATABASE_URL);
  configSource = "DATABASE_URL";
} else if (process.env.MYSQL_URL) {
  dbConfig = parseConnectionUrl(process.env.MYSQL_URL);
  configSource = "MYSQL_URL";
} else if (process.env.MYSQL_PUBLIC_URL) {
  dbConfig = parseConnectionUrl(process.env.MYSQL_PUBLIC_URL);
  configSource = "MYSQL_PUBLIC_URL";
} else {
  const railwayConfig = getRailwayConfig();

  if (railwayConfig && railwayConfig.host) {
    dbConfig = railwayConfig;
    configSource = "Railway MYSQL_* variables";
  } else {
    dbConfig = {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || DEFAULT_PORT,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "pulseapi_db",
    };
  }
}

console.log("DB config source:", configSource);
console.log("DB_HOST:", dbConfig.host);
console.log("DB_PORT:", dbConfig.port);
console.log("DB_USER:", dbConfig.user);
console.log("DB_NAME:", dbConfig.database);

const db = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 3,
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