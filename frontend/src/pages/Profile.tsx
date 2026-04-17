import { useState } from "react";
import "./Profile.css";

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
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

  return <div className="profile-avatar-initials">{initials}</div>;
}

// placeholder date utilizator (mai tarziu vor veni din Backend)
const userData = {
  firstName: "Maria",
  lastName: "Popescu",
  email: "maria.popescu@exemplu.com",
  bio: "Pasionată de pictură în acuarelă și drumeții montane. Caut oameni faini pentru a împărtăși hobby-uri!",
  organizedEventsCount: 5,
  joinedEventsCount: 12,
  rating: 4.8,
};

export default function Profile() {
  // stare pentru a sti ce tab este selectat
  const [activeTab, setActiveTab] = useState<
    "organized" | "joined" | "reports"
  >("organized");

  return (
    <div className="profile-page-container">
      <div className="profile-layout">
        {/* coloana stanga: Sidebar */}
        <aside className="profile-sidebar profile-card">
          <div className="profile-avatar-container">
            <AvatarWithInitials
              firstName={userData.firstName}
              lastName={userData.lastName}
            />
          </div>

          <h1 className="profile-name">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="profile-email">{userData.email}</p>

          <p className="profile-bio">{userData.bio}</p>

          <div className="profile-actions">
            <button className="btn-edit-profile">Editează profilul</button>
            <button className="btn-change-password">Schimbă parola</button>
          </div>
        </aside>

        {/* coloana dreapta: main content*/}
        <main className="profile-main-content">
          {/* sectiunea de statistici*/}
          <section className="profile-stats-grid">
            <div className="stat-item profile-card">
              <span className="stat-value">
                {userData.organizedEventsCount}
              </span>
              <span className="stat-label">Evenimente organizate</span>
            </div>
            <div className="stat-item profile-card">
              <span className="stat-value">{userData.joinedEventsCount}</span>
              <span className="stat-label">Evenimente înscrise</span>
            </div>
            <div className="stat-item profile-card">
              <span className="stat-value">
                {userData.rating}
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
                    Atelier de pictură - Sâmbătă 14:00
                  </div>
                  <div className="placeholder-list-item">
                    Club de lectură - Joi 18:00
                  </div>
                  {/* mai târziu aici vom mapa o lista reala */}
                </div>
              )}
              {activeTab === "joined" && (
                <div className="tab-pane">
                  <h3>Evenimente la care ai participat</h3>
                  <div className="placeholder-list-item">
                    Campionat de Catan - Acum 2 zile
                  </div>
                  <div className="placeholder-list-item">
                    Seară de Boardgames - Săptămâna trecută
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
