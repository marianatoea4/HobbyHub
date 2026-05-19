import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StaticPages.css";

export default function FAQ() {
  return (
    <div className="static-page-wrapper">
      <Navbar />
      <div className="static-page-container">
        <h1 className="static-page-title">Întrebări frecvente (FAQ)</h1>
        <div className="static-page-content">
          <div className="faq-item">
            <div className="faq-question">Cum mă înscriu la un eveniment?</div>
            <p className="faq-answer">
              Navighează pe pagina "Explorează evenimente", dă click pe "Vezi
              detalii" la evenimentul dorit, apoi apasă butonul de înscriere.
              Organizatorul va primi o notificare și va trebui să valideze
              participarea ta.
            </p>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              Costă să creez un eveniment pe HobbyHub?
            </div>
            <p className="faq-answer">
              Nu! Crearea și organizarea evenimentelor pe platforma noastră este
              complet gratuită. Vrem să încurajăm cât mai mult inițiativele
              locale și dezvoltarea comunităților.
            </p>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              Ce se întâmplă dacă nu mai pot ajunge la un eveniment?
            </div>
            <p className="faq-answer">
              Dacă te-ai înscris, dar a intervenit ceva, te rugăm să mergi la
              detaliile evenimentului sau în profilul tău și să selectezi
              opțiunea de "Retragere". Astfel, eliberezi locul pentru altcineva
              interesat.
            </p>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              Cum funcționează sistemul de rating?
            </div>
            <p className="faq-answer">
              După încheierea unui eveniment, participanții pot acorda un rating
              organizatorului, iar organizatorul poate evalua participanții.
              Acest sistem ajută la menținerea unei comunități respectuoase și
              sigure.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
