import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import Navbar from "../components/Navbar";
import API from "../services/api";

function EndpointDetails() {
  const { id } = useParams();

  const [endpoint, setEndpoint] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEndpointDetails = async () => {
    try {
      const endpointResponse = await API.get(`/endpoints/${id}`);
      const logsResponse = await API.get(`/endpoints/${id}/logs`);

      setEndpoint(endpointResponse.data);
      setLogs(logsResponse.data);
    } catch (error) {
      console.log("Failed to fetch endpoint details", error);
    } finally {
      setLoading(false);
    }
  };

  const checkNow = async () => {
    try {
      await API.post(`/endpoints/${id}/check-now`);
      fetchEndpointDetails();
    } catch (error) {
      console.log("Failed to check endpoint", error);
      alert("Failed to check endpoint");
    }
  };

  useEffect(() => {
    fetchEndpointDetails();
  }, [id]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString();
  };

  const chartData = useMemo(() => {
    return [...logs]
      .reverse()
      .slice(-30)
      .map((log) => ({
        time: new Date(log.checked_at).toLocaleTimeString(),
        responseTime: log.response_time || 0,
        status: log.status,
      }));
  }, [logs]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="dashboard">
          <p>Loading endpoint details...</p>
        </main>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div>
        <Navbar />
        <main className="dashboard">
          <div className="empty-box">
            <h3>Endpoint not found</h3>
            <Link to="/dashboard" className="add-btn">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>{endpoint.name}</h1>
            <p>{endpoint.url}</p>
          </div>

          <button className="add-btn" onClick={checkNow}>
            Check Now
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>
              <span
                className={
                  endpoint.status === "UP"
                    ? "status-up"
                    : endpoint.status === "DOWN"
                      ? "status-down"
                      : "status-unknown"
                }
              >
                {endpoint.status}
              </span>
            </h3>
            <p>Current Status</p>
          </div>

          <div className="stat-card">
            <h3>{endpoint.response_time || 0} ms</h3>
            <p>Latest Response Time</p>
          </div>

          <div className="stat-card">
            <h3>{endpoint.uptime_percentage || 100}%</h3>
            <p>Uptime</p>
          </div>

          <div className="stat-card">
            <h3>{endpoint.method}</h3>
            <p>Method</p>
          </div>
        </div>

        <div className="details-info-card">
          <div>
            <strong>Category</strong>
            <p>{endpoint.category || "General"}</p>
          </div>

          <div>
            <strong>Last Checked</strong>
            <p>{formatDate(endpoint.last_checked_at)}</p>
          </div>

          <div>
            <strong>Created At</strong>
            <p>{formatDate(endpoint.created_at)}</p>
          </div>
        </div>

        <div className="chart-card">
          <h2>Response Time Chart</h2>

          {chartData.length === 0 ? (
            <p>No response time data available yet.</p>
          ) : (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 7, fill: "#1d4ed8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="table-card">
          <h2>API Logs</h2>

          {logs.length === 0 ? (
            <p>No logs available yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Checked At</th>
                  <th>Status</th>
                  <th>Status Code</th>
                  <th>Response Time</th>
                  <th>Error Message</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.checked_at)}</td>
                    <td>
                      <span
                        className={
                          log.status === "UP" ? "status-up" : "status-down"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td>{log.status_code || "-"}</td>
                    <td>{log.response_time || 0} ms</td>
                    <td>{log.error_message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default EndpointDetails;