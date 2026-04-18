import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // pentru erori
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // aceasta functie se apeleaza cand apasam pe butonul de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // previne reincarcarea paginii

    // resetam erorile
    setEmailError("");
    setPasswordError("");

    try{
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if(response.ok){
        const data = await response.json();
        console.log("Login reușit!", data);
        // te redirecteaza la profil momentan, dupa ce adaugam home page o sa schimbam aici
        navigate("/profile");
      }else {
        if (response.status === 404) {
          setEmailError("Email incorect");
          setEmail("");    // Goleste email
          setPassword(""); // Goleste parola
        } else if (response.status === 401) {
          setPasswordError("Parola este incorectă");
          setPassword(""); // Goleste doar parola
        }
      }
    }catch (error) {
      console.error("Eroare la conexiune:", error);
      alert("Serverul nu răspunde!");
      }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">HobbyHub</h1>
        <p className="login-subtitle">
          Bine ai revenit! Loghează-te pentru a continua.
        </p>

        <form onSubmit={handleLogin}>
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
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          <button type="submit" className="login-btn">
            Intră în cont
          </button>
        </form>

        <div className="login-footer">
          Nu ai încă un cont?
          <Link to="/signup">Creează unul acum</Link>
        </div>
      </div>
    </div>
  );
}
