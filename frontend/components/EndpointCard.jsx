import { Link } from "react-router-dom";

function EndpointCard({ endpoint, onDelete, onCheckNow }) {
  const formatDate = (dateValue) => {
    if (!dateValue) return "Not checked yet";

    return new Date(dateValue).toLocaleString();
  };

  return (
    <div className="endpoint-card">
      <div className="endpoint-header">
        <h3>{endpoint.name}</h3>

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

      <p className="category-badge">{endpoint.category || "General"}</p>

      <p className="url">{endpoint.url}</p>

      <div className="endpoint-stats">
        <div>
          <strong>{endpoint.method}</strong>
          <span>Method</span>
        </div>

        <div>
          <strong>{endpoint.response_time || 0} ms</strong>
          <span>Response Time</span>
        </div>

        <div>
          <strong>{endpoint.uptime_percentage || 100}%</strong>
          <span>Uptime</span>
        </div>
      </div>

      <p className="last-checked">
        Last Checked: {formatDate(endpoint.last_checked_at)}
      </p>

      <div className="card-actions">
        <Link className="details-btn" to={`/endpoint/${endpoint.id}`}>
          View Details
        </Link>

        <button className="check-btn" onClick={() => onCheckNow(endpoint.id)}>
          Check Now
        </button>

        <button className="delete-btn" onClick={() => onDelete(endpoint.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default EndpointCard;