import Navbar from "../components/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  // date provizorii (placeholder) pana se leaga backend-ul
  const recommendedEvents = [
    {
      id: 1,
      title: "Drumeție Vârful Omu",
      category: "Sport / Natură",
      date: "15 Mai",
      location: "Bușteni",
    },
    {
      id: 2,
      title: "Atelier pictură acuarelă",
      category: "Artă",
      date: "18 Mai",
      location: "București",
    },
    {
      id: 3,
      title: "Boardgames Night",
      category: "Social",
      date: "20 Mai",
      location: "Cluj-Napoca",
    },
  ];

  const upcomingEvents = [
    { id: 4, title: "Curs de fotografie", date: "10 Mai" },
    { id: 5, title: "Maratonul lecturii", date: "12 Mai" },
  ];

  return (
    <div className="dashboard-page">
      {/* navbar-ul este integrat sus */}
      <Navbar />

      <main className="dashboard-content">
        <h1 className="welcome-text">Salut, Maria!</h1>

        <div className="dashboard-grid">
          {/* Coloana principala: Recomandari */}
          <section className="dashboard-section">
            <h2 className="section-title">Recomandate pentru tine</h2>

            <div className="events-list">
              {recommendedEvents.map((event) => (
                <div key={event.id} className="event-mini-card">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>
                      {event.category} • {event.location}
                    </p>
                  </div>
                  <div className="event-date">{event.date}</div>
                </div>
              ))}
            </div>
          </section>

          {/* coloana laterala: activitatea ta */}
          <section className="dashboard-section">
            <h2 className="section-title">Urmează să participi</h2>

            <div className="events-list">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="event-mini-card">
                    <div className="event-info">
                      <h4>{event.title}</h4>
                    </div>
                    <div className="event-date">{event.date}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#666" }}>
                  Nu te-ai înscris la niciun eveniment viitor.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
