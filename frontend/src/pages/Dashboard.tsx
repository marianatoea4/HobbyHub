import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

// structura evenimentelor reale din baza de date
interface EventData {
  id: number;
  title: string;
  category: string;
  dateTime: string;
}

export default function Dashboard() {
  const [userName, setUserName] = useState("Utilizator");
  const [recommendedEvents, setRecommendedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Stările noi pentru evenimentele la care participi
  const [joinedEvents, setJoinedEvents] = useState<EventData[]>([]);
  const [loadingJoined, setLoadingJoined] = useState(true);

  useEffect(() => {
    let loggedInUserId: number | null = null;

    // 1. preluam numele si ID-ul utilizatorului din localstorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.firstName) setUserName(userData.firstName);
        if (userData.id) loggedInUserId = userData.id;
      } catch (e) {
        console.error("eroare la parsarea utilizatorului din localstorage");
      }
    }

    // 2. preluam evenimentele din backend (recomandate)
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

    /// 3. preluam evenimentele la care utilizatorul s-a înscris
    const fetchJoinedEvents = async (userId: number) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/enrollments/user/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();

          // MODIFICAREA ESTE AICI:
          // Parcurgem datele primite. Dacă primim "Enrollment", luăm doar partea de "event" din el.
          // Dacă primim direct "Event", îl lăsăm așa.
          const extractedEvents = data.map((item: any) =>
            item.event ? item.event : item,
          );

          setJoinedEvents(extractedEvents);
        }
      } catch (error) {
        console.error("Eroare la preluarea evenimentelor înscrise:", error);
      } finally {
        setLoadingJoined(false);
      }
    };

    fetchRecommendedEvents();

    if (loggedInUserId) {
      fetchJoinedEvents(loggedInUserId);
    } else {
      setLoadingJoined(false);
    }
  }, []);

  // functie pentru a face data mai frumusica gen 15 mai
  const formatShortDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        {/* Cardul nou pentru mesajul de bun venit */}
        <div className="welcome-card">
          <h1 className="welcome-text">Salut, {userName}!</h1>
          <p className="welcome-subtext">
            Bine ai revenit pe HobbyHub! Ce pasiuni explorezi astăzi?
          </p>
        </div>

        <div className="dashboard-grid">
          {/* coloana principala recomandari */}
          <section className="dashboard-section">
            <h2 className="section-title">Recomandate pentru tine</h2>

            <div className="events-list">
              {loading ? (
                <p style={{ color: "#666" }}>Se încarcă recomandările...</p>
              ) : recommendedEvents.length > 0 ? (
                recommendedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="event-mini-card"
                    onClick={() =>
                      navigate(`/events/${event.id}`)
                    } /* ADAUGAT: Navigare la click */
                  >
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p>{event.category}</p> {/* STERS: Vezi pe harta */}
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

          {/* coloana laterala activitatea ta (acum dinamica) */}
          <section className="dashboard-section">
            <h2 className="section-title">Urmează să participi</h2>

            <div className="events-list">
              {loadingJoined ? (
                <p style={{ color: "#666" }}>Se încarcă evenimentele tale...</p>
              ) : joinedEvents.length > 0 ? (
                joinedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="event-mini-card"
                    onClick={() =>
                      navigate(`/events/${event.id}`)
                    } /* ADAUGAT: Navigare la click */
                  >
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p>{event.category}</p>
                    </div>
                    <div className="event-date">
                      {formatShortDate(event.dateTime)}
                    </div>
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
