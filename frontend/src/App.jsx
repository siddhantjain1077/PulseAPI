import { Navigate, Route, Routes } from "react-router-dom";

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
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

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

      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;