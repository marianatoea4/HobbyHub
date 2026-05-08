import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // verificam daca exista un utilizator logat in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Coloana 1: Branding & Descriere */}
        <div className="footer-section footer-about">
          <h3 className="footer-logo">
            Hobby<span className="highlight">Hub</span>
          </h3>
          <p>
            Descoperă pasiuni noi, conectează-te cu oameni noi și creează
            evenimente unice în comunitatea ta.
          </p>
        </div>

        {/* Coloana 2: Navigare  */}
        <div className="footer-section footer-links">
          <h4>Navigare</h4>
          <ul>
            {isLoggedIn ? (
              <>
                {/* Linkuri pentru utilizatori logati */}
                <li>
                  <Link to="/dashboard">Acasă</Link>
                </li>
                <li>
                  <Link to="/events">Explorează evenimente</Link>
                </li>
                <li>
                  <Link to="/profile">Profilul meu</Link>
                </li>
                <li>
                  <Link to="/create-event">Creează eveniment</Link>
                </li>
              </>
            ) : (
              <>
                {/* Linkuri pentru vizitatori (neconectati) */}
                <li>
                  <Link to="/">Acasă</Link>
                </li>
                <li>
                  <Link to="/login">Intră în cont</Link>
                </li>
                <li>
                  <Link to="/signup">Înregistrare</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Coloana 3: Comunitate & Legal (Vizibilă pentru toți) */}
        <div className="footer-section footer-links">
          <h4>Comunitate</h4>
          <ul>
            <li>
              <Link to="/despre-noi">Despre Noi</Link>
            </li>
            <li>
              <Link to="/termeni">Termeni și Condiții</Link>
            </li>
            <li>
              <Link to="/confidentialitate">Politica de Confidențialitate</Link>
            </li>
            <li>
              <Link to="/faq">Ajutor / FAQ</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bara de Copyright */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} HobbyHub. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
}
