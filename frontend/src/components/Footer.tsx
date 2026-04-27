import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Coloana 1: branding & descriere */}
        <div className="footer-section footer-about">
          <h3 className="footer-logo">
            Hobby<span className="highlight">Hub</span>
          </h3>
          <p>
            Descoperă pasiuni noi, conectează-te cu oameni și creează evenimente
            unice în comunitatea ta.
          </p>
        </div>

        {/* Coloana 2: Navigare rapida */}
        <div className="footer-section footer-links">
          <h4>Navigare</h4>
          <ul>
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
          </ul>
        </div>

        {/* Coloana 3: Comunitate & Legal */}
        <div className="footer-section footer-links">
          <h4>Comunitate</h4>
          <ul>
            <li>
              <a href="#">Despre noi</a>
            </li>
            <li>
              <a href="#">Termeni și Condiții</a>
            </li>
            <li>
              <a href="#">Politica de confidențialitate</a>
            </li>
            <li>
              <a href="#">Ajutor / FAQ</a>
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
