import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Preluam ID-ul utilizatorului curent
  const getCurrentUserId = (): number | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr).id;
    } catch {
      return null;
    }
  };

  // Verificam mesajele necitite
  const fetchUnreadCount = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/unread?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      // Serverul nu raspunde - ignoram
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Polling la fiecare 5 secunde
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
        <Link to="/messages" className="nav-item nav-messages-link">
          Mesaje
          {unreadCount > 0 && (
            <span className="nav-unread-badge">{unreadCount}</span>
          )}
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
