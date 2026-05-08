import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // stare noua pentru a sti daca afisam meniul de vizitator sau de utilizator
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // preluam ID-ul utilizatorului curent
  const getCurrentUserId = (): number | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr).id;
    } catch {
      return null;
    }
  };

  // verificam mesajele necitite (modificata sa primeasca ID-ul ca parametru)
  const fetchUnreadCount = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/messages/unread?userId=${userId}`,
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
    const userId = getCurrentUserId();

    // verificam daca avem utilizator logat
    if (userId) {
      setIsLoggedIn(true);
      fetchUnreadCount(userId);

      // polling la fiecare 5 secunde doar daca e logat
      const interval = setInterval(() => fetchUnreadCount(userId), 5000);
      return () => clearInterval(interval);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      {/* Daca e logat, logo-ul duce la Dashboard. Daaă nu, duce la Landing Page (Acasa) */}
      <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo">
        <img
          src="/favicon4.png"
          alt="HobbyHub Logo"
          className="navbar-logo-img"
        />
        <span>HobbyHub</span>
      </Link>

      <div className="navbar-links">
        {/* AICI ESTE MAGIA: Randam conditional in functie de isLoggedIn */}
        {isLoggedIn ? (
          <>
            {/* MENIUL PENTRU UTILIZATOR CONECTAT */}
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
          </>
        ) : (
          <>
            {/* MENIUL PENTRU VIZITATOR (ca pe Landing Page) */}
            <Link to="/login" className="nav-item">
              Intră în cont
            </Link>
            <Link to="/signup" className="nav-btn-create">
              Înregistrare
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
