import React, { useEffect, useState } from "react";
import { getProfile } from "../api";

export default function Dashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Tableau de bord</h2>
      {profile ? (
        <div>
          <p>Nom : {profile.nom}</p>
          <p>Prénom : {profile.prenom}</p>
          <p>Email : {profile.email}</p>
          <p>Adresse : {profile.adresse}</p>
          <p>Téléphone : {profile.telephone}</p>
        </div>
      ) : (
        <p>Chargement…</p>
      )}
      <button onClick={onLogout}>Se déconnecter</button>
    </div>
  );
}
