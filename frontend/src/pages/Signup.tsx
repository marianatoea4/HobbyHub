import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // pentru erori
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // resetam erorile
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!termsAccepted) {
      setGeneralError(
        "Te rugăm să accepți Termenii și Condițiile pentru a continua.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.status === 201) {
        // inregistrare reusita - redirectam la login
        console.log("Înregistrare reușită!");
        navigate("/login");
      } else {
        const errorCode = await response.text();

        switch (errorCode) {
          case "EMPTY_FIELDS":
            setGeneralError("Toate câmpurile sunt obligatorii.");
            break;
          case "INVALID_EMAIL":
            setEmailError("Email-ul nu are un format valid.");
            setEmail("");
            break;
          case "INVALID_PASSWORD":
            setPasswordError(
              "Parola trebuie să aibă min. 8 caractere, 1 majusculă, 1 cifră, 1 caracter special.",
            );
            setPassword("");
            break;
          case "EMAIL_ALREADY_EXISTS":
            setEmailError("Acest email este deja asociat unui cont.");
            setEmail("");
            setPassword("");
            break;
          default:
            setGeneralError("A apărut o eroare. Încearcă din nou.");
            break;
        }
      }
    } catch (error) {
      console.error("Eroare la conexiune:", error);
      setGeneralError("Serverul nu răspunde!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Creează cont</h1>
        <p className="signup-subtitle">Alătură-te comunității HobbyHub!</p>

        {generalError && <span className="error-message">{generalError}</span>}

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
              className={emailError ? "input-error" : ""}
              required
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "input-error" : ""}
              required
            />
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
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
