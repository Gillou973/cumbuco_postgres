import React, { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await login(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } else {
      setError(data.error || "Erreur de connexion.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto" }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Se connecter</button>
    </form>
  );
}
