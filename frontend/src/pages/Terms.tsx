import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StaticPages.css";

export default function Terms() {
  return (
    <div className="static-page-wrapper">
      <Navbar />
      <div className="static-page-container">
        <h1 className="static-page-title">Termeni și Condiții</h1>
        <div className="static-page-content">
          <p>
            Bine ați venit pe HobbyHub! Accesarea și utilizarea acestei
            platforme sunt supuse următorilor termeni și condiții. Vă rugăm să
            îi citiți cu atenție înainte de a vă crea un cont.
          </p>
          <h3>1. Crearea contului</h3>
          <p>
            Pentru a utiliza funcționalitățile platformei (înscrierea la
            evenimente, crearea evenimentelor), trebuie să vă creați un cont.
            Sunteți responsabil pentru păstrarea confidențialității parolei
            dumneavoastră.
          </p>
          <h3>2. Organizarea evenimentelor</h3>
          <p>
            Organizatorii au obligația de a furniza informații reale și complete
            despre evenimentele pe care le postează (locație, oră, costuri dacă
            există). HobbyHub nu este responsabil pentru anularea sau
            modificarea condițiilor unui eveniment de către organizator.
          </p>
          <h3>3. Conduită și comunitate</h3>
          <p>
            Platforma încurajează respectul și toleranța. Este strict interzisă
            utilizarea platformei pentru a promova discursuri instigatoare la
            ură, violență sau activități ilegale. Conturile care încalcă aceste
            reguli vor fi suspendate imediat de către moderatori.
          </p>
          <h3>4. Limitarea răspunderii</h3>
          <p>
            HobbyHub acționează ca un intermediar între utilizatori. Nu ne
            asumăm răspunderea pentru accidentele, incidentele sau neplăcerile
            cauzate în timpul desfășurării efective a evenimentelor în lumea
            reală.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
