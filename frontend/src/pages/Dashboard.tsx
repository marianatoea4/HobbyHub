import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";

// aici am modificat pentru a defini structura evenimentelor reale din baza de date
interface EventData {
  id: number;
  title: string;
  category: string;
  dateTime: string;
  // adaugam doar campurile de care avem nevoie in dashboard
}

export default function Dashboard() {
  // aici am modificat pentru a stoca numele real si evenimentele
  const [userName, setUserName] = useState("Utilizator");
  const [recommendedEvents, setRecommendedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // date ramase hardcodate pentru evenimentele la care participi
  const upcomingEvents = [
    { id: 4, title: "Curs de fotografie", date: "10 Mai" },
    { id: 5, title: "Maratonul lecturii", date: "12 Mai" },
  ];

  // aici am modificat pentru a extrage datele cand se incarca pagina
  useEffect(() => {
    // 1. preluam numele utilizatorului din localstorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.firstName) {
          setUserName(userData.firstName);
        }
      } catch (e) {
        console.error("eroare la parsarea utilizatorului din localstorage");
      }
    }

    // 2. preluam evenimentele din backend
    const fetchRecommendedEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events/all");
        if (response.ok) {
          const data = await response.json();
          // luam doar primele 3 evenimente pentru sectiunea de recomandari
          setRecommendedEvents(data.slice(0, 3));
        }
      } catch (error) {
        console.error("eroare la preluarea evenimentelor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedEvents();
  }, []);

  // aici am modificat pentru a face data mai frumusica gen 15 mai
  const formatShortDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        {/* aici am modificat pentru a afisa dinamic numele real */}
        <h1 className="welcome-text">Salut, {userName}!</h1>

        <div className="dashboard-grid">
          {/* coloana principala recomandari */}
          <section className="dashboard-section">
            <h2 className="section-title">Recomandate pentru tine</h2>

            <div className="events-list">
              {/* aici am modificat pentru a parcurge lista reala de evenimente */}
              {loading ? (
                <p style={{ color: "#666" }}>Se încarcă recomandările...</p>
              ) : recommendedEvents.length > 0 ? (
                recommendedEvents.map((event) => (
                  <div key={event.id} className="event-mini-card">
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p>{event.category} • Vezi pe hartă</p>
                    </div>
                    <div className="event-date">
                      {formatShortDate(event.dateTime)}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#666" }}>
                  Momentan nu există evenimente recomandate.
                </p>
              )}
            </div>
          </section>

          {/* coloana laterala activitatea ta */}
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
      <Footer />
    </div>
  );
}
