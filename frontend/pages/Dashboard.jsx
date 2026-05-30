import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import Navbar from "../components/Navbar";
import EndpointCard from "../components/EndpointCard";
import API from "../services/api";

function Dashboard() {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const fetchEndpoints = async () => {
    try {
      const response = await API.get("/endpoints");
      setEndpoints(response.data);
    } catch (error) {
      console.log("Failed to fetch endpoints", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEndpoint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this endpoint?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/endpoints/${id}`);
      fetchEndpoints();
    } catch (error) {
      console.log("Failed to delete endpoint", error);
    }
  };

  const checkNow = async (id) => {
    try {
      await API.post(`/endpoints/${id}/check-now`);
      fetchEndpoints();
    } catch (error) {
      console.log("Failed to check endpoint", error);
      alert("Failed to check endpoint");
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const totalApis = endpoints.length;
  const upApis = endpoints.filter((endpoint) => endpoint.status === "UP").length;
  const downApis = endpoints.filter(
    (endpoint) => endpoint.status === "DOWN"
  ).length;
  const unknownApis = endpoints.filter(
    (endpoint) => endpoint.status === "UNKNOWN"
  ).length;

  const chartData = [
    { name: "UP", value: upApis },
    { name: "DOWN", value: downApis },
    { name: "UNKNOWN", value: unknownApis },
  ];

  const categories = useMemo(() => {
    const uniqueCategories = endpoints.map(
      (endpoint) => endpoint.category || "General"
    );

    return ["ALL", ...new Set(uniqueCategories)];
  }, [endpoints]);

  const filteredEndpoints = useMemo(() => {
    let data = [...endpoints];

    if (searchText.trim() !== "") {
      data = data.filter((endpoint) => {
        const text = searchText.toLowerCase();

        return (
          endpoint.name.toLowerCase().includes(text) ||
          endpoint.url.toLowerCase().includes(text) ||
          (endpoint.category || "General").toLowerCase().includes(text)
        );
      });
    }

    if (statusFilter !== "ALL") {
      data = data.filter((endpoint) => endpoint.status === statusFilter);
    }

    if (categoryFilter !== "ALL") {
      data = data.filter(
        (endpoint) => (endpoint.category || "General") === categoryFilter
      );
    }

    if (sortBy === "RESPONSE_TIME_LOW") {
      data.sort((a, b) => Number(a.response_time) - Number(b.response_time));
    }

    if (sortBy === "RESPONSE_TIME_HIGH") {
      data.sort((a, b) => Number(b.response_time) - Number(a.response_time));
    }

    if (sortBy === "UPTIME_HIGH") {
      data.sort(
        (a, b) => Number(b.uptime_percentage) - Number(a.uptime_percentage)
      );
    }

    if (sortBy === "UPTIME_LOW") {
      data.sort(
        (a, b) => Number(a.uptime_percentage) - Number(b.uptime_percentage)
      );
    }

    if (sortBy === "NEWEST") {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return data;
  }, [endpoints, searchText, statusFilter, categoryFilter, sortBy]);

  return (
    <div>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>API Monitoring Dashboard</h1>
            <p>Monitor uptime, response time, and API health.</p>
          </div>

          <Link to="/add-endpoint" className="add-btn">
            Add Endpoint
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{totalApis}</h3>
            <p>Total APIs</p>
          </div>

          <div className="stat-card">
            <h3>{upApis}</h3>
            <p>APIs UP</p>
          </div>

          <div className="stat-card">
            <h3>{downApis}</h3>
            <p>APIs DOWN</p>
          </div>

          <div className="stat-card">
            <h3>{unknownApis}</h3>
            <p>Unknown</p>
          </div>
        </div>

        <div className="chart-card">
          <h2>API Health Overview</h2>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="filter-card">
          <input
            type="text"
            placeholder="Search by API name, URL, or category"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="UP">UP</option>
            <option value="DOWN">DOWN</option>
            <option value="UNKNOWN">UNKNOWN</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option value={category} key={category}>
                {category === "ALL" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="NEWEST">Newest First</option>
            <option value="RESPONSE_TIME_LOW">Response Time: Low to High</option>
            <option value="RESPONSE_TIME_HIGH">Response Time: High to Low</option>
            <option value="UPTIME_HIGH">Uptime: High to Low</option>
            <option value="UPTIME_LOW">Uptime: Low to High</option>
          </select>
        </div>

        <h2 className="section-title">Monitored Endpoints</h2>

        {loading ? (
          <p>Loading endpoints...</p>
        ) : filteredEndpoints.length === 0 ? (
          <div className="empty-box">
            <h3>No endpoints found</h3>
            <p>Try changing your search or filter options.</p>
          </div>
        ) : (
          <div className="endpoint-grid">
            {filteredEndpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onDelete={deleteEndpoint}
                onCheckNow={checkNow}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;