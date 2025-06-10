import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("token") ? true : false;
  });
  const [mode, setMode] = useState("login"); // "login" ou "register"

  const handleLogin = () => setUser(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(false);
    setMode("login");
  };

  if (!user) {
    return (
      <div>
        {mode === "login" ? (
          <>
            <Login onLogin={handleLogin} />
            <p>
              Pas de compte ?{" "}
              <button onClick={() => setMode("register")}>S’inscrire</button>
            </p>
          </>
        ) : (
          <>
            <Register onRegister={() => setMode("login")} />
            <p>
              Déjà un compte ?{" "}
              <button onClick={() => setMode("login")}>Se connecter</button>
            </p>
          </>
        )}
      </div>
    );
  }
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
