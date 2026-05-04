import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StaticPages.css";

export default function AboutUs() {
  return (
    <div className="static-page-wrapper">
      <Navbar />
      <div className="static-page-container">
        <h1 className="static-page-title">Despre HobbyHub</h1>
        <div className="static-page-content">
          <p>
            HobbyHub s-a născut dintr-o idee simplă: pasiunile sunt mult mai
            frumoase atunci când sunt împărtășite. Într-o lume din ce în ce mai
            digitalizată, ne-am propus să readucem oamenii împreună în lumea
            reală, conectați de interese comune.
          </p>
          <h3>Misiunea noastră</h3>
          <p>
            Vrem să construim punți între oameni. Fie că ești un expert în artă,
            un pasionat de fotbal de weekend sau doar vrei să înveți cum se fac
            cele mai bune clătite la cămin, HobbyHub îți oferă platforma pentru
            a găsi comunitatea ta.
          </p>
          <h3>Ce ne face speciali?</h3>
          <ul>
            <li>
              <strong>Conexiuni reale:</strong> Trecem dincolo de ecran și
              facilităm întâlniri față în față.
            </li>
            <li>
              <strong>Siguranță:</strong> Sistemul nostru de rating și validare
              ajută la crearea unui mediu de încredere.
            </li>
            <li>
              <strong>Accesibilitate:</strong> Oricine poate fi organizator sau
              participant, fără bariere tehnice.
            </li>
          </ul>
          <p>
            Echipa HobbyHub vă mulțumește că faceți parte din această călătorie.
            Continuați să explorați, să învățați și să vă bucurați de pasiunile
            voastre!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
