import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import API from "../services/api";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const response = await API.get("/endpoints/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.log("Failed to fetch incidents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString();
  };

  return (
    <div>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Incident Management</h1>
            <p>Track API downtime incidents and resolutions.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading incidents...</p>
        ) : incidents.length === 0 ? (
          <div className="empty-box">
            <h3>No incidents found</h3>
            <p>Your APIs are currently running smoothly.</p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Incident</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Resolved</th>
                  <th>Duration</th>
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.title}</td>
                    <td>{incident.endpoint_name}</td>
                    <td>
                      <span
                        className={
                          incident.status === "ONGOING"
                            ? "status-down"
                            : "status-up"
                        }
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td>{formatDate(incident.started_at)}</td>
                    <td>{formatDate(incident.resolved_at)}</td>
                    <td>
                      {incident.duration_minutes !== null
                        ? `${incident.duration_minutes} min`
                        : "-"}
                    </td>
                    <td>{incident.error_message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Incidents;