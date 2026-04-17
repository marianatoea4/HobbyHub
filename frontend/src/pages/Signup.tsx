import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Te rugăm să accepți Termenii și Condițiile pentru a continua.");
      return;
    }

    // aici vom trimite datele către backend-ul de Java (POST /api/auth/register)
    console.log("Date de înregistrare:", {
      firstName,
      lastName,
      email,
      password,
    });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Creează cont</h1>
        <p className="signup-subtitle">Alătură-te comunității HobbyHub!</p>

        <form onSubmit={handleSignup}>
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="lastName">Nume</label>
              <input
                type="text"
                id="lastName"
                placeholder="Popescu"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Prenume</label>
              <input
                type="text"
                id="firstName"
                placeholder="Ion"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="nume@exemplu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" style={{ margin: 0, fontWeight: "normal" }}>
              Sunt de acord cu Termenii și Condițiile.
            </label>
          </div>

          <button type="submit" className="signup-btn">
            Creează cont
          </button>
        </form>

        <div className="signup-footer">
          Ai deja un cont?
          <Link to="/login">Loghează-te aici</Link>
        </div>
      </div>
    </div>
  );
}
