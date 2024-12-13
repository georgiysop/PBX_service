// Filename - App.js
import "./App.css";
import React, { useState, useEffect } from "react";
import Registration from "./components/Registration/Registration";
import Menu from "./components/menu/menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Widgets from "./components/Widgets/Widgets";
import Reports from "./components/Reports/Reports";
import Admin from "./components/Admin/admin";
import Rings from "./components/Rings/Rings";
import Logout from "./components/Logout/Logout";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  //Проверяем состояние сессии при загрузке страницы
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (isLoggedIn) => {
    setLoggedIn(isLoggedIn);
  };

  return (
    <BrowserRouter>
      {loggedIn ? (
        <div className="app-wrapper">
          <Menu />
          <Routes>
            <Route path="/" element={<Widgets />} />
            <Route path="/login" element={<Widgets />} />
            <Route path="/Widgets" element={<Widgets />} />
            <Route path="/Rings" element={<Rings />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Logout" element={<Logout />} />
          </Routes>
        </div>
      ) : (
        <Registration onLogin={handleLogin} />
      )}
    </BrowserRouter>
  );
}

export default App;
