import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StaticPages.css";

export default function Privacy() {
  return (
    <div className="static-page-wrapper">
      <Navbar />
      <div className="static-page-container">
        <h1 className="static-page-title">Politica de confidențialitate</h1>
        <div className="static-page-content">
          <p>
            La HobbyHub, protejarea datelor tale personale este o prioritate.
            Această politică explică ce informații colectăm, cum le folosim și
            cum le protejăm.
          </p>
          <h3>Datele pe care le colectăm</h3>
          <p>
            Când te înregistrezi, colectăm date precum: numele, prenumele,
            adresa de e-mail, parola (criptată) și o scurtă descriere
            (opțional). În plus, dacă organizezi evenimente, putem stoca
            locațiile aproximative setate de tine.
          </p>
          <h3>Cum folosim datele</h3>
          <ul>
            <li>
              Pentru a-ți oferi acces la funcționalitățile platformei
              (autentificare, mesagerie internă).
            </li>
            <li>
              Pentru a permite organizatorilor să valideze participarea ta la un
              eveniment.
            </li>
            <li>
              Pentru a personaliza recomandările de evenimente din Dashboard-ul
              tău.
            </li>
          </ul>
          <h3>Securitatea datelor</h3>
          <p>
            Parolele tale sunt stocate sub formă de hash securizat. HobbyHub nu
            va vinde niciodată datele tale către terțe părți în scopuri de
            marketing.
          </p>
          <p>
            Dacă dorești ștergerea completă a contului și a datelor tale, poți
            trimite o solicitare către adresa noastră de suport.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
