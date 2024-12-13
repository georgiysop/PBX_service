import React, { useState } from "react";
import logo_SFR from "../menu/logos/sfr.png";
import s from "./Registration.module.css";
import Button from "@mui/material/Button";

function Registration({ onLogin }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    const login = event.target.login.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        onLogin(true);
      } else {
        const errorData = await response.json();
        console.error("Ошибка авторизации:", errorData.error);
        alert("Неправильный пароль или логин");
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
    }
  };

  return (
    <div className={s.regwrapper}>
      <div className={s.reg2wrapper}>
        <img src={logo_SFR} className={s.SFR_logo} />
        <form onSubmit={handleLogin}>
          <div className={s.floating}>
            <input
              type="text"
              name="login"
              placeholder="Login"
              className={s.input}
            />
          </div>
          <div className={s.floating}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={s.input}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 10,
                fontWeight: 700,
              }}
              type="submit"
              onSubmit={handleLogin}
            >
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
