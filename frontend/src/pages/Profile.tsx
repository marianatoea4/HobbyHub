import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Interfață pentru datele utilizatorului primite de la API
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  organizedEventsCount?: number;
  joinedEventsCount?: number;
  rating?: number;
}

// Component for Star icon
function StarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#a0c878"
      style={{
        display: "inline-block",
        marginLeft: "6px",
        verticalAlign: "middle",
      }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Component for Avatar with initials
function AvatarWithInitials({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = ((firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")).toUpperCase();

  return <div className="profile-avatar-initials">{initials}</div>;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Stări pentru editare profil
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: "", lastName: "" });

  // Stări pentru schimbare parolă
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // stare pentru a sti ce tab este selectat
  const [activeTab, setActiveTab] = useState<
    "organized" | "joined" | "reports"
  >("organized");

  // Preluăm ID-ul din localStorage
  const getLoggedInUserId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return userData.id;
    } catch (e) {
      return null;
    }
  };

  const userId = getLoggedInUserId();

  const fetchUserData = () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Eroare la încărcarea profilului");
        return response.json();
      })
      .then((data) => {
        setUser({
          ...data,
          bio: "Pasionat de tehnologie și hobby-uri noi. Utilizator activ HobbyHub!",
          organizedEventsCount: 3,
          joinedEventsCount: 8,
          rating: 4.9
        });
        setEditData({ firstName: data.firstName, lastName: data.lastName });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setIsChangingPassword(false);
    if (user) {
      setEditData({ firstName: user.firstName, lastName: user.lastName });
    }
  };

  const handleChangePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    setIsEditing(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Eroare la salvarea modificărilor");
        return response.json();
      })
      .then(() => {
        setIsEditing(false);
        fetchUserData();
      })
      .catch((err) => alert(err.message));
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Parolele noi nu coincid!");
      return;
    }

    fetch(`http://localhost:8080/api/users/${userId}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMsg = await response.text();
          if (errorMsg === "INVALID_PASSWORD") {
            throw new Error("Parola nouă nu respectă regulile (min. 8 caractere, o majusculă, o cifră, un caracter special).");
          } else if (errorMsg === "WRONG_PASSWORD") {
            throw new Error("Parola actuală este incorectă.");
          }
          throw new Error("Eroare la schimbarea parolei. Încearcă din nou.");
        }
        alert("Parola a fost schimbată cu succes!");
        setIsChangingPassword(false);
      })
      .catch((err) => alert(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <div className="profile-page-container">Se încarcă...</div>;
  if (error) return <div className="profile-page-container">Eroare: {error}</div>;
  if (!user) return <div className="profile-page-container">Utilizatorul nu a fost găsit.</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-layout">
        {/* coloana stanga: Sidebar */}
        <aside className="profile-sidebar profile-card">
          <div className="profile-avatar-container">
            <AvatarWithInitials
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </div>

          {!isEditing && !isChangingPassword ? (
            <>
              <h1 className="profile-name">
                {user.firstName} {user.lastName}
              </h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-actions">
                <button className="btn-edit-profile" onClick={handleEditToggle}>Editează profilul</button>
                <button className="btn-change-password" onClick={handleChangePasswordToggle}>Schimbă parola</button>
                <button className="btn-logout" onClick={handleLogout} style={{ marginTop: '10px', backgroundColor: '#ff4d4d' }}>Log Out</button>
              </div>
            </>
          ) : isEditing ? (
            <div className="edit-form">
              <h3>Editează Profilul</h3>
              <div className="input-group">
                <label>Prenume</label>
                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Nume</label>
                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-actions">
                <button className="btn-edit-profile save-btn" onClick={handleSave}>Salvează</button>
                <button className="btn-edit-profile cancel-btn" onClick={handleEditToggle}>Anulează</button>
              </div>
            </div>
          ) : (
            <div className="edit-form">
              <h3>Schimbă parola</h3>
              <div className="input-group">
                <label>Parola actuală</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div className="input-group">
                <label>Parola nouă</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div className="input-group">
                <label>Confirmă parola nouă</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div className="profile-actions">
                <button className="btn-change-password save-btn" onClick={handlePasswordSave}>Salvează parola</button>
                <button className="btn-change-password cancel-btn" onClick={handleChangePasswordToggle}>Anulează</button>
              </div>
            </div>
          )}
        </aside>

        {/* coloana dreapta: main content*/}
        <main className="profile-main-content">
          {/* sectiunea de statistici*/}
          <section className="profile-stats-grid">
            <div className="stat-item profile-card">
              <span className="stat-value">
                {user.organizedEventsCount}
              </span>
              <span className="stat-label">Evenimente organizate</span>
            </div>
            <div className="stat-item profile-card">
              <span className="stat-value">{user.joinedEventsCount}</span>
              <span className="stat-label">Evenimente înscrise</span>
            </div>
            <div className="stat-item profile-card">
              <span className="stat-value">
                {user.rating}
                <StarIcon />
              </span>
              <span className="stat-label">Rating utilizator</span>
            </div>
          </section>

          {/* sectiunea de activitate cu tab-uri*/}
          <section className="profile-activity-card profile-card">
            <div className="profile-tabs-header">
              <button
                className={`tab-button ${activeTab === "organized" ? "active" : ""}`}
                onClick={() => setActiveTab("organized")}
              >
                Evenimentele mele
              </button>
              <button
                className={`tab-button ${activeTab === "joined" ? "active" : ""}`}
                onClick={() => setActiveTab("joined")}
              >
                Istoric înscrieri
              </button>
              <button
                className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
                onClick={() => setActiveTab("reports")}
              >
                Raportări
              </button>
            </div>

            <div className="profile-tabs-content">
              {activeTab === "organized" && (
                <div className="tab-pane">
                  <h3>Evenimente organizate de tine</h3>
                  <div className="placeholder-list-item">
                    Atelier de codare - Azi 19:00
                  </div>
                </div>
              )}
              {activeTab === "joined" && (
                <div className="tab-pane">
                  <h3>Evenimente la care ai participat</h3>
                  <div className="placeholder-list-item">
                    Meetup HobbyHub - Ieri
                  </div>
                </div>
              )}
              {activeTab === "reports" && (
                <div className="tab-pane">
                  <h3>Istoricul raportărilor tale</h3>
                  <div className="placeholder-list-item">
                    Nu există raportări active.
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
