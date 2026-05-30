const db = require("../config/db");
const { checkSingleEndpoint } = require("../services/apiChecker");

exports.addEndpoint = (req, res) => {
  const { name, url, method, category } = req.body;
  const userId = req.user.id;

  if (!name || !url) {
    return res.status(400).json({
      message: "Name and URL are required",
    });
  }

  const sql = `
    INSERT INTO endpoints 
    (user_id, name, url, method, category) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, name, url, method || "GET", category || "General"],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to add endpoint",
          error,
        });
      }

      res.status(201).json({
        message: "Endpoint added successfully",
        endpointId: result.insertId,
      });
    }
  );
};

exports.checkEndpointNow = (req, res) => {
  const endpointId = req.params.id;
  const userId = req.user.id;

  const sql = "SELECT * FROM endpoints WHERE id = ? AND user_id = ?";

  db.query(sql, [endpointId, userId], async (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch endpoint",
        error,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Endpoint not found",
      });
    }

    try {
      const endpoint = results[0];

      await checkSingleEndpoint(endpoint);

      const updatedSql = "SELECT * FROM endpoints WHERE id = ?";

      db.query(updatedSql, [endpointId], (updateError, updatedResults) => {
        if (updateError) {
          return res.status(500).json({
            message: "Endpoint checked but failed to fetch updated data",
            error: updateError,
          });
        }

        res.json({
          message: "Endpoint checked successfully",
          endpoint: updatedResults[0],
        });
      });
    } catch (checkError) {
      res.status(500).json({
        message: "Manual check failed",
        error: checkError.message,
      });
    }
  });
};

exports.getEndpointById = (req, res) => {
  const endpointId = req.params.id;
  const userId = req.user.id;

  const sql = "SELECT * FROM endpoints WHERE id = ? AND user_id = ?";

  db.query(sql, [endpointId, userId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch endpoint",
        error,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Endpoint not found",
      });
    }

    res.json(results[0]);
  });
};

exports.getEndpointLogs = (req, res) => {
  const endpointId = req.params.id;
  const userId = req.user.id;

  const checkSql = "SELECT * FROM endpoints WHERE id = ? AND user_id = ?";

  db.query(checkSql, [endpointId, userId], (checkError, endpointResults) => {
    if (checkError) {
      return res.status(500).json({
        message: "Failed to verify endpoint",
        error: checkError,
      });
    }

    if (endpointResults.length === 0) {
      return res.status(404).json({
        message: "Endpoint not found",
      });
    }

    const logsSql = `
      SELECT *
      FROM api_logs
      WHERE endpoint_id = ?
      ORDER BY checked_at DESC
      LIMIT 100
    `;

    db.query(logsSql, [endpointId], (logsError, logsResults) => {
      if (logsError) {
        return res.status(500).json({
          message: "Failed to fetch logs",
          error: logsError,
        });
      }

      res.json(logsResults);
    });
  });
};

exports.getEndpoints = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM endpoints WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch endpoints",
        error,
      });
    }

    res.json(results);
  });
};

exports.deleteEndpoint = (req, res) => {
  const endpointId = req.params.id;
  const userId = req.user.id;

  const sql = "DELETE FROM endpoints WHERE id = ? AND user_id = ?";

  db.query(sql, [endpointId, userId], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete endpoint",
        error,
      });
    }

    res.json({
      message: "Endpoint deleted successfully",
    });
  });
};

exports.bulkImportEndpoints = (req, res) => {
  const userId = req.user.id;
  const { endpoints } = req.body;

  if (!Array.isArray(endpoints) || endpoints.length === 0) {
    return res.status(400).json({
      message: "Endpoints array is required",
    });
  }

  const values = endpoints.map((endpoint) => [
    userId,
    endpoint.name,
    endpoint.url,
    endpoint.method || "GET",
    endpoint.category || "General",
  ]);

  const sql = `
    INSERT INTO endpoints
    (user_id, name, url, method, category)
    VALUES ?
  `;

  db.query(sql, [values], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Bulk import failed",
        error,
      });
    }

    res.status(201).json({
      message: `${result.affectedRows} endpoints imported successfully`,
    });
  });
};

exports.getPublicStatus = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      id, name, url, method, category, status, response_time, 
      uptime_percentage, last_checked_at
    FROM endpoints
    WHERE user_id = ?
    ORDER BY category ASC, name ASC
  `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch public status",
        error,
      });
    }

    const total = results.length;
    const down = results.filter((item) => item.status === "DOWN").length;
    const up = results.filter((item) => item.status === "UP").length;

    let overallStatus = "All Systems Operational";

    if (total === 0) {
      overallStatus = "No APIs Available";
    } else if (down > 0) {
      overallStatus = "Some Systems Are Down";
    }

    res.json({
      overallStatus,
      total,
      up,
      down,
      endpoints: results,
    });
  });
};

exports.getIncidents = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      incidents.*,
      endpoints.name AS endpoint_name,
      endpoints.url AS endpoint_url
    FROM incidents
    JOIN endpoints ON incidents.endpoint_id = endpoints.id
    WHERE endpoints.user_id = ?
    ORDER BY incidents.started_at DESC
  `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch incidents",
        error,
      });
    }

    res.json(results);
  });
};