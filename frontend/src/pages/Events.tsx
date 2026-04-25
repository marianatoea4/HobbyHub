import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Events.css";

const CustomDropdown = ({
  options,
  value,
  onChange,
  defaultLabel,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  defaultLabel: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="custom-select-container"
      tabIndex={0}
      onBlur={(e) => {
        // Închide dropdown-ul dacă dăm click în afara lui
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className={`custom-select-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || defaultLabel}</span>
        <span className="custom-select-arrow">▼</span>
      </div>

      {isOpen && (
        <ul className="custom-select-list">
          <li
            className={`custom-select-item ${value === "" ? "selected" : ""}`}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            {defaultLabel}
          </li>
          {options.map((opt) => (
            <li
              key={opt}
              className={`custom-select-item ${value === opt ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// definesc cum arata un eveniment venit din Java
interface EventData {
  id: number;
  title: string;
  category: string;
  dateTime: string;
  capacity: number;
  lat: number;
  lng: number;
  images: { id: number; imageUrl: string }[];
}

export default function Events() {
  // stochez evenimentele reale venite din baza de date
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // stari pentru filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  // !!! momentan filtrul de locatie e doar vizual, deoarece in DB avem doar coordonate GPS (lat/lng)
  const [location, setLocation] = useState("");

  // functia care aduce datele din Java
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events/all");
        if (response.ok) {
          const data = await response.json();
          setEvents(data); // salvez datele in state
        } else {
          console.error("Eroare la preluarea evenimentelor");
        }
      } catch (error) {
        console.error("Eroare de rețea:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // logica de filtrare a evenimentelor reale
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category === "" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  // functie pentru a formata data din "2026-05-24T10:00:00" in "24 Mai 2026, 10:00"
  const formatDate = (dateString: string) => {
    if (!dateString) return "Dată nesetată";
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

        {/* <section className="filters-container">
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
            <option value="Sport">Sport</option>
            <option value="Gaming">Gaming</option>
            <option value="Gătit">Gătit</option>
            <option value="Muzică">Muzică</option>
            <option value="Altele">Altele</option>
          </select>

          <select
            className="filter-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Toate locațiile</option>
            <option value="București">București</option>
            <option value="Cluj-Napoca">Cluj-Napoca</option>
          </select>
        </section> */}
        {/* BARA DE FILTRARE */}
        <section className="filters-container">
          <input
            type="text"
            placeholder="Caută după nume..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <CustomDropdown
            defaultLabel="Toate categoriile"
            value={category}
            onChange={setCategory}
            options={["Artă", "Sport", "Gaming", "Gătit", "Muzică", "Altele"]}
          />

          <CustomDropdown
            defaultLabel="Toate locațiile"
            value={location}
            onChange={setLocation}
            options={[
              "București",
              "Cluj-Napoca",
              "Timișoara",
              "Bușteni",
              "Online",
            ]}
          />
        </section>
        {/* GRILA DE EVENIMENTE */}
        <section className="events-grid">
          {loading ? (
            <h3
              style={{
                textAlign: "center",
                width: "100%",
                gridColumn: "1 / -1",
              }}
            >
              Se încarcă evenimentele...
            </h3>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  {/* daca are imagine salvata o afism, altfel punem un emoji */}
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={`http://localhost:8080${event.images[0].imageUrl}`}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "LALALA"
                  )}
                </div>
                <div className="event-details">
                  <span className="event-category-badge">{event.category}</span>
                  <h3 className="event-title">{event.title}</h3>

                  <div className="event-info-row">
                    <span className="event-info-icon">📅</span>
                    {formatDate(event.dateTime)}
                  </div>
                  <div className="event-info-row">
                    <span className="event-info-icon">📍</span>
                    Vezi pe hartă
                  </div>

                  <div className="event-footer">
                    <span className="event-spots">
                      {event.capacity} locuri libere
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
              <h3>Nu am găsit evenimente...</h3>
              <p>Fii tu cel care organizează primul eveniment!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
