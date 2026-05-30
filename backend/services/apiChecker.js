const axios = require("axios");
const cron = require("node-cron");
const db = require("../config/db");
const { sendDownAlertEmail } = require("./emailService");

const checkSingleEndpoint = async (endpoint) => {
  const startTime = Date.now();
  const previousStatus = endpoint.status;

  try {
    const response = await axios({
      method: endpoint.method || "GET",
      url: endpoint.url,
      timeout: 10000,
    });

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;
    const status = statusCode >= 200 && statusCode < 400 ? "UP" : "DOWN";

    await saveApiLog(endpoint.id, status, responseTime, statusCode, null);

    await updateEndpointStatus(endpoint.id, status, responseTime);

    if (status === "UP" && previousStatus === "DOWN") {
      await resolveIncident(endpoint.id);
    }

    if (status === "DOWN" && previousStatus !== "DOWN") {
      await createIncident(endpoint.id, endpoint.name, "API returned non-success status");
      await sendAlertToUser(endpoint, "API returned non-success status");
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const statusCode = error.response?.status || null;
    const errorMessage = error.message || "API request failed";

    await saveApiLog(endpoint.id, "DOWN", responseTime, statusCode, errorMessage);

    await updateEndpointStatus(endpoint.id, "DOWN", responseTime);

    if (previousStatus !== "DOWN") {
      await createIncident(endpoint.id, endpoint.name, errorMessage);
      await sendAlertToUser(endpoint, errorMessage);
    }
  }
};

const saveApiLog = (endpointId, status, responseTime, statusCode, errorMessage) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO api_logs 
      (endpoint_id, status, response_time, status_code, error_message)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [endpointId, status, responseTime, statusCode, errorMessage],
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

const updateEndpointStatus = async (endpointId, status, responseTime) => {
  const uptimePercentage = await calculateUptime(endpointId);

  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE endpoints
      SET status = ?, response_time = ?, uptime_percentage = ?, last_checked_at = NOW()
      WHERE id = ?
    `;

    db.query(
      sql,
      [status, responseTime, uptimePercentage, endpointId],
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

const calculateUptime = (endpointId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) AS totalChecks,
        SUM(CASE WHEN status = 'UP' THEN 1 ELSE 0 END) AS upChecks
      FROM api_logs
      WHERE endpoint_id = ?
    `;

    db.query(sql, [endpointId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      const totalChecks = results[0].totalChecks || 0;
      const upChecks = results[0].upChecks || 0;

      if (totalChecks === 0) {
        resolve(100);
        return;
      }

      const uptime = (upChecks / totalChecks) * 100;
      resolve(Number(uptime.toFixed(2)));
    });
  });
};

const createIncident = (endpointId, endpointName, errorMessage) => {
  return new Promise((resolve, reject) => {
    const checkSql = `
      SELECT * FROM incidents
      WHERE endpoint_id = ? AND status = 'ONGOING'
      LIMIT 1
    `;

    db.query(checkSql, [endpointId], (checkError, existingIncidents) => {
      if (checkError) {
        reject(checkError);
        return;
      }

      if (existingIncidents.length > 0) {
        resolve(existingIncidents[0]);
        return;
      }

      const insertSql = `
        INSERT INTO incidents (endpoint_id, title, status, error_message)
        VALUES (?, ?, 'ONGOING', ?)
      `;

      db.query(
        insertSql,
        [endpointId, `${endpointName} is DOWN`, errorMessage],
        (insertError, result) => {
          if (insertError) reject(insertError);
          else resolve(result);
        }
      );
    });
  });
};

const resolveIncident = (endpointId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE incidents
      SET 
        status = 'RESOLVED',
        resolved_at = NOW(),
        duration_minutes = TIMESTAMPDIFF(MINUTE, started_at, NOW())
      WHERE endpoint_id = ? AND status = 'ONGOING'
    `;

    db.query(sql, [endpointId], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

const sendAlertToUser = (endpoint, errorMessage) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT email FROM users
      WHERE id = ?
    `;

    db.query(sql, [endpoint.user_id], async (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      if (results.length === 0) {
        resolve();
        return;
      }

      const userEmail = results[0].email;

      await sendDownAlertEmail(userEmail, endpoint, errorMessage);
      resolve();
    });
  });
};

const checkAllEndpoints = () => {
  const sql = "SELECT * FROM endpoints";

  db.query(sql, async (error, endpoints) => {
    if (error) {
      console.log("Failed to fetch endpoints for checking:", error);
      return;
    }

    console.log(`Checking ${endpoints.length} endpoints...`);

    for (const endpoint of endpoints) {
      await checkSingleEndpoint(endpoint);
    }

    console.log("Endpoint check completed");
  });
};

const startApiChecker = () => {
  console.log("API checker started");

  cron.schedule("* * * * *", () => {
    checkAllEndpoints();
  });

  checkAllEndpoints();
};

module.exports = {
  startApiChecker,
  checkSingleEndpoint,
};