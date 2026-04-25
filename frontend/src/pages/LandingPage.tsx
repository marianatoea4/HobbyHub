import { Link } from "react-router-dom";
import "./LandingPage.css";

function PaletteIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#a0c878"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="24" r="20" />
      <circle cx="18" cy="18" r="2" fill="#a0c878" />
      <circle cx="30" cy="16" r="2" fill="#8eb36a" />
      <circle cx="32" cy="28" r="2" fill="#ddeb9d" />
      <circle cx="20" cy="34" r="2" fill="#c9dd85" />
      <path d="M24 12c6.6 0 12 5.4 12 12s-5.4 12-12 12" strokeDasharray="8,4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#a0c878"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="10" width="32" height="28" rx="2" />
      <path d="M16 6v8M32 6v8" />
      <path d="M8 22h32" />
      <circle cx="20" cy="32" r="2" fill="#a0c878" />
      <circle cx="32" cy="32" r="2" fill="#a0c878" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#a0c878"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="14" r="4" />
      <circle cx="32" cy="14" r="4" />
      <path d="M10 30c0-4.4 2.4-8 6-8h12c3.6 0 6 3.6 6 8v6H10z" />
      <path d="M26 24c1-1 1.5-3 1.5-4.5" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* bara de navigare */}
      <nav className="landing-navbar">
        <Link to="/" className="logo">
          HobbyHub
        </Link>
        <div className="nav-links">
          <Link to="/login" className="nav-link-login">
            Intră în cont
          </Link>
          <Link to="/signup" className="nav-btn-signup">
            Înregistrare
          </Link>
        </div>
      </nav>

      {/* sectiunea principala */}
      <header className="hero-section">
        <h1 className="hero-title">
          Descoperă pasiuni noi și <span>conectează-te</span> cu alții.
        </h1>
        <p className="hero-subtitle">
          HobbyHub este locul unde interesele tale prind viață. Găsește
          evenimente locale, organizează propriile întâlniri și construiește
          prietenii în jurul pasiunilor comune.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">
            Începe acum gratuit!
          </Link>
          <Link to="/login" className="btn-secondary">
            Am deja un cont.
          </Link>
        </div>
      </header>

      {/* sectiunea cu informatii */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <PaletteIcon />
          </div>
          <h3 className="feature-title">Explorează hobby-uri</h3>
          <p className="feature-desc">
            De la pictură la drumeții montane, găsește activități care te
            inspiră și te scot din rutină.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <CalendarIcon />
          </div>
          <h3 className="feature-title">Organizează evenimente</h3>
          <p className="feature-desc">
            Ai o idee grozavă? Creează un eveniment, stabilește detaliile și
            invită comunitatea să participe.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <PeopleIcon />
          </div>
          <h3 className="feature-title">Cunoaște oameni</h3>
          <p className="feature-desc">
            Conectează-te cu persoane care împărtășesc aceleași pasiuni.
            Schimbați păreri și creați amintiri.
          </p>
        </div>
      </section>

      {/* footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 HobbyHub. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}
