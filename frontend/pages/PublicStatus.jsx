import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

function PublicStatus() {
  const { userId } = useParams();

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicStatus = async () => {
    try {
      const response = await API.get(`/endpoints/public-status/${userId}`);
      setStatusData(response.data);
    } catch (error) {
      console.log("Failed to fetch public status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicStatus();
  }, [userId]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not checked yet";
    return new Date(dateValue).toLocaleString();
  };

  if (loading) {
    return (
      <div className="public-page">
        <p>Loading public status...</p>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="public-page">
        <h1>Status page not found</h1>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-status-card">
        <h1>PulseAPI Status Page</h1>

        <div
          className={
            statusData.down > 0
              ? "overall-status down-overall"
              : "overall-status up-overall"
          }
        >
          {statusData.overallStatus}
        </div>

        <div className="public-stats">
          <div>
            <strong>{statusData.total}</strong>
            <span>Total APIs</span>
          </div>

          <div>
            <strong>{statusData.up}</strong>
            <span>Operational</span>
          </div>

          <div>
            <strong>{statusData.down}</strong>
            <span>Down</span>
          </div>
        </div>

        <h2>Services</h2>

        <div className="public-endpoint-list">
          {statusData.endpoints.map((endpoint) => (
            <div className="public-endpoint" key={endpoint.id}>
              <div>
                <h3>{endpoint.name}</h3>
                <p>{endpoint.category || "General"}</p>
                <small>Last checked: {formatDate(endpoint.last_checked_at)}</small>
              </div>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicStatus;