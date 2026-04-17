import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // aceasta functie se apeleaza cand apasam pe butonul de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // previne reincarcarea paginii
    console.log("Se trimit datele către backend:", { email, password });
    // mai tarziu aici vom face conexiunea cu backend-ul in Java!
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
            />
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
