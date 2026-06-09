import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddEndpoint from "../pages/AddEndpoint";
import BulkImport from "../pages/BulkImport";
import Incidents from "../pages/Incidents";
import PublicStatus from "../pages/PublicStatus";
import EndpointDetails from "../pages/EndpointDetails";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
w2
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-endpoint"
        element={
          <ProtectedRoute>
            <AddEndpoint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bulk-import"
        element={
          <ProtectedRoute>
            <BulkImport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <Incidents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/endpoint/:id"
        element={
          <ProtectedRoute>
            <EndpointDetails />
          </ProtectedRoute>
        }
      />

      <Route path="/status/:userId" element={<PublicStatus />} />
    </Routes>
  );
}

export default App;