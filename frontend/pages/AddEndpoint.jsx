import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function AddEndpoint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    category: "General",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddEndpoint = async (event) => {
    event.preventDefault();

    try {
      await API.post("/endpoints", formData);

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add endpoint");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="form-page">
        <div className="form-card">
          <h1>Add API Endpoint</h1>
          <p>Add an API URL that you want to monitor.</p>

          <form onSubmit={handleAddEndpoint}>
            <label>API Name</label>
            <input
              type="text"
              name="name"
              placeholder="Example: GitHub API"
              value={formData.name}
              onChange={handleChange}
            />

            <label>API URL</label>
            <input
              type="url"
              name="url"
              placeholder="https://api.github.com"
              value={formData.url}
              onChange={handleChange}
            />

            <label>Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="Example: Developer APIs"
              value={formData.category}
              onChange={handleChange}
            />

            <button type="submit">Add Endpoint</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </main>
    </div>
  );
}

export default AddEndpoint;