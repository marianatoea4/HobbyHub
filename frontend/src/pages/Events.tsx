import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Events.css";

// date provizorii pentru evenimente (placeholder)
const mockEvents = [
  {
    id: 1,
    title: "Atelier de Ceramică pentru Începători",
    category: "Artă",
    date: "24 Mai, 10:00",
    location: "București",
    spots: 5,
    image: "🏺",
  },
  {
    id: 2,
    title: "Drumeție de Weekend: Vârful Omu",
    category: "Sport / Natură",
    date: "28 Mai, 07:00",
    location: "Bușteni",
    spots: 12,
    image: "⛰️",
  },
  {
    id: 3,
    title: "Seară de Boardgames și Pizza",
    category: "Social",
    date: "1 Iunie, 19:00",
    location: "Cluj-Napoca",
    spots: 20,
    image: "🎲",
  },
  {
    id: 4,
    title: "Curs Foto: Portrete în Lumină Naturală",
    category: "Artă",
    date: "5 Iunie, 16:00",
    location: "București",
    spots: 8,
    image: "📷",
  },
  {
    id: 5,
    title: "Hackathon de Weekend",
    category: "Tehnologie",
    date: "10 Iunie, 09:00",
    location: "Timișoara",
    spots: 50,
    image: "💻",
  },
  {
    id: 6,
    title: "Grup de Lectură: Literatura SF",
    category: "Cultură",
    date: "12 Iunie, 18:30",
    location: "Online",
    spots: 15,
    image: "📚",
  },
];

export default function Events() {
  // Stari pentru filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Logica de filtrare a evenimentelor
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category === "" || event.category === category;
    const matchesLocation = location === "" || event.location === location;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="events-page">
      <Navbar />

      <main className="events-content">
        <header className="events-header">
          <h1>Descoperă evenimente</h1>
          <p>
            Găsește activitățile care te pasionează și alătură-te comunității.
          </p>
        </header>

        {/* BARA DE FILTRARE */}
        <section className="filters-container">
          <input
            type="text"
            placeholder="Caută după nume..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toate categoriile</option>
            <option value="Artă">Artă</option>
            <option value="Sport / Natură">Sport / Natură</option>
            <option value="Social">Social</option>
            <option value="Tehnologie">Tehnologie</option>
            <option value="Cultură">Cultură</option>
          </select>

          <select
            className="filter-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Toate locațiile</option>
            <option value="București">București</option>
            <option value="Cluj-Napoca">Cluj-Napoca</option>
            <option value="Timișoara">Timișoara</option>
            <option value="Bușteni">Bușteni</option>
            <option value="Online">Online</option>
          </select>
        </section>

        {/* GRILA DE EVENIMENTE */}
        <section className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">{event.image}</div>
                <div className="event-details">
                  <span className="event-category-badge">{event.category}</span>
                  <h3 className="event-title">{event.title}</h3>

                  <div className="event-info-row">
                    <span className="event-info-icon">📅</span>
                    {event.date}
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-icon">📍</span>
                    {event.location}
                  </div>

                  <div className="event-footer">
                    <span className="event-spots">
                      {event.spots} locuri libere
                    </span>
                    <button className="btn-view-event">Vezi detalii</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                width: "100%",
                gridColumn: "1 / -1",
                padding: "50px",
                color: "#666",
              }}
            >
              <h3>Nu am găsit evenimente conform filtrelor tale...</h3>
              <p>
                Încearcă să modifici căutarea sau fii tu cel care organizează
                primul eveniment!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
