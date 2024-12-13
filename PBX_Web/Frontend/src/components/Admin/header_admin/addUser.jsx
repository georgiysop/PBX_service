import React, { useState } from "react";
import Button from "@mui/material/Button";

export default function AddUser() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleAddUser = async () => {
    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/addlogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login, password }),
        }
      );

      if (response.ok) {
        alert("Пользователь успешно добавлен");
      } else if (response.status === 409) {
        const errorData = await response.json();
        alert(errorData.error || "Пользователь с таким логином уже существует");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка при добавлении пользователя");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при добавлении пользователя");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <div style={{ marginLeft: 200 }}>
        <input
          type="text"
          placeholder="login"
          style={{ padding: 7, fontSize: 16 }}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div style={{ marginLeft: 10 }}>
        <input
          type="password"
          placeholder="password"
          style={{ padding: 7, fontSize: 16 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div style={{ marginLeft: 20 }}>
        <Button
          variant="contained"
          style={{ padding: 7 }}
          onClick={handleAddUser}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
}
