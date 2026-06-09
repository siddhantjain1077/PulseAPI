const db = require("./db");

const initDatabase = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS endpoints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      url VARCHAR(500) NOT NULL,
      method VARCHAR(10) DEFAULT 'GET',
      category VARCHAR(100) DEFAULT 'General',
      status VARCHAR(20) DEFAULT 'UNKNOWN',
      response_time INT DEFAULT 0,
      uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
      last_checked_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS api_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint_id INT NOT NULL,
      status VARCHAR(20) NOT NULL,
      response_time INT,
      status_code INT,
      error_message TEXT,
      checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (endpoint_id) REFERENCES endpoints(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS incidents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'ONGOING',
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP NULL,
      duration_minutes INT DEFAULT NULL,
      error_message TEXT,
      FOREIGN KEY (endpoint_id) REFERENCES endpoints(id) ON DELETE CASCADE
    )`,
  ];

  queries.forEach((query) => {
    db.query(query, (error) => {
      if (error) {
        console.log("Table creation failed:", error.message);
      } else {
        console.log("Table checked/created successfully");
      }
    });
  });
};

module.exports = initDatabase;