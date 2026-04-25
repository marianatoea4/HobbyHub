import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // aici vom sterge datele sesiunii mai tarziu
    console.log("Deconectare...");
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      <Link to="/dashboard" className="navbar-logo">
        <img
          src="/favicon4.png"
          alt="HobbyHub Logo"
          className="navbar-logo-img"
        />
        <span>HobbyHub</span>
      </Link>

      <div className="navbar-links">
        <Link to="/dashboard" className="nav-item">
          Acasă
        </Link>
        <Link to="/events" className="nav-item">
          Explorează evenimente
        </Link>
        <Link to="/create-event" className="nav-btn-create">
          Crează eveniment
        </Link>

        <div className="nav-profile-group">
          <Link to="/profile" className="nav-item">
            Profilul meu
          </Link>
          <button onClick={handleLogout} className="nav-btn-logout">
            Ieși
          </button>
        </div>
      </div>
    </nav>
  );
}
