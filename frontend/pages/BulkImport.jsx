import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function BulkImport() {
  const navigate = useNavigate();

  const sampleJson = `[
  {
    "name": "JSONPlaceholder Posts",
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "category": "Testing"
  },
  {
    "name": "DummyJSON Products",
    "url": "https://dummyjson.com/products",
    "method": "GET",
    "category": "Public APIs"
  },
  {
    "name": "GitHub API",
    "url": "https://api.github.com",
    "method": "GET",
    "category": "Developer APIs"
  },
  {
    "name": "Broken Test API",
    "url": "https://wrong-api-test-12345.com/data",
    "method": "GET",
    "category": "Failure Testing"
  }
]`;

  const [jsonInput, setJsonInput] = useState(sampleJson);
  const [message, setMessage] = useState("");

  const handleBulkImport = async (event) => {
    event.preventDefault();

    try {
      const parsedData = JSON.parse(jsonInput);

      const response = await API.post("/endpoints/bulk-import", {
        endpoints: parsedData,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setMessage("Invalid JSON format");
      } else {
        setMessage(error.response?.data?.message || "Bulk import failed");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <main className="form-page">
        <div className="form-card large-form-card">
          <h1>Bulk Import APIs</h1>
          <p>Paste JSON data to add multiple APIs at once.</p>

          <form onSubmit={handleBulkImport}>
            <label>Endpoints JSON</label>

            <textarea
              className="json-textarea"
              value={jsonInput}
              onChange={(event) => setJsonInput(event.target.value)}
            />

            <button type="submit">Import APIs</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </main>
    </div>
  );
}

export default BulkImport;