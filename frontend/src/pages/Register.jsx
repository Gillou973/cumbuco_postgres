import React, { useState } from "react";
import { register } from "../api";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ nom: "", prenom: "", adresse: "", email: "", telephone: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    const data = await register(form);
    if (data.userId) {
      setMessage("Inscription réussie ! Connectez-vous.");
      setForm({ nom: "", prenom: "", adresse: "", email: "", telephone: "", password: "" });
      if (onRegister) onRegister();
    } else {
      setError(data.error || "Erreur à l'inscription.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto" }}>
      <h2>Inscription</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
      <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
      <input name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
      <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} required />
      <input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={handleChange} required />
      <button type="submit">S’inscrire</button>
    </form>
  );
}
