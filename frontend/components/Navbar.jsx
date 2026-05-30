import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>PulseAPI</h2>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-endpoint">Add Endpoint</Link>
        <Link to="/bulk-import">Bulk Import</Link>
        <Link to="/incidents">Incidents</Link>

        <span>{user?.name}</span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;