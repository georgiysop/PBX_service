require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Для генерации JWT
const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const appp = express();

const db = new sqlite3.Database("../PBX_SQLite/database.db");

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};
appp.options("*", cors(corsOptions));
appp.use(cors(corsOptions));

appp.use(express.json());
appp.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
  .toString()
  .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
  .getHours()
  .toString()
  .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
  .getSeconds()
  .toString()
  .padStart(2, "0")}`;
// console.log(formattedDate); // Выведет дату и время в формате YYYY-MM-DD HH:mm:ss

//Функция для генерации токена
function generateToken(login) {
  const secretKey = process.env.JWT_SECRET;
  const payload = { login: login };
  const token = jwt.sign(payload, secretKey);
  return token;
}

//--------------------------------АВТОРИЗАЦИЯ------------------------------------------------------------------------------------------

appp.post("/login", async (req, res) => {
  const { login, password } = req.body;

  // Получаем пользователя из базы данных
  const row = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM Accounts WHERE login = ?", [login], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

  if (!row) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  // Сравниваем пароль
  const isPasswordCorrect = await bcrypt.compare(password, row.password);

  if (isPasswordCorrect) {
    // Генерируем токен
    const token = generateToken(login);

    // Сохраняем токен в сессию
    req.session.token = token;
    req.session.login = login; // Сохраняем логин для удобства

    // Отправляем токен клиенту
    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
});

appp.post("/logout", (req, res) => {
  // Удаляем токен из куки
  // res.clearCookie("token");

  // Завершаем сессию
  req.session.destroy((err) => {
    if (err) {
      console.error("Ошибка при завершении сессии:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
    res.status(200).json({ message: "Вы успешно вышли из аккаунта" });
  });
});

appp.post("/addlogin", async (req, res) => {
  const { login, password } = req.body;

  try {
    // Проверка существования пользователя
    db.get("SELECT 1 FROM Accounts WHERE login = ?", [login], (err, row) => {
      if (err) {
        console.error("Ошибка проверки пользователя:", err);
        return res
          .status(500)
          .json({ error: "Ошибка при проверке пользователя" });
      }

      if (row) {
        // Пользователь уже существует
        return res
          .status(409)
          .json({ error: "Пользователь с таким логином уже существует" });
      } else {
        // Хеширование пароля
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            // Вставка пользователя в базу данных
            db.run(
              "INSERT INTO Accounts (login, password) VALUES (?, ?)",
              [login, hashedPassword],
              (err) => {
                if (err) {
                  console.error("Ошибка вставки:", err);
                  return res
                    .status(500)
                    .json({ error: "Ошибка при добавлении пользователя" });
                }
                res
                  .status(200)
                  .json({ message: "Пользователь успешно добавлен" });
              }
            );
          })
          .catch((error) => {
            console.error("Ошибка хеширования:", error);
            res.status(500).json({ error: "Ошибка сервера" });
          });
      }
    });
  } catch (error) {
    console.error("Ошибка проверки:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

//--------------------------------ЗВОНКИ------------------------------------------------------------------------------------------
// Получение всех данных из таблицы звонков этого месяца
appp.get("/allRings", (req, res) => {
  db.all("SELECT * FROM Rings ", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});
// Получение данных звонков за определенный период времени
appp.get("/allRingsdate", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (!startDate || !endDate) {
    db.all(
      "SELECT * FROM Rings WHERE strftime('%Y-%m', date_time_start) = strftime('%Y-%m', ?) ",
      [formattedDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("error");
        }
        res.json(rows);
      }
    );
  } else {
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
    db.all(
      "SELECT * FROM Rings WHERE date(date_start) BETWEEN ? AND ?",
      [formattedStartDate, formattedEndDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("errdor");
        }

        res.json(rows);
      }
    );
  }
});

//--------------------------------ЗАПРОСЫ ПО ВИДЖЕТАМ-----------------------------------------------------------------------

//Получение данных из таблицы звонков(сколько было в день)
appp.get("/rings_widget1/callsCountToday", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM Rings WHERE date(date_start) = date(?)",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget1/callsCountToday_Mobile", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM Rings WHERE date(date_start) = date(?) AND type_ring = 'Мобильный'",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget1/callsCountToday_Urban", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM Rings WHERE date(date_start) = date(?) AND type_ring = 'Городской'",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget1/callsCountToday_Intercity", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM Rings WHERE date(date_start) = date(?) AND type_ring = 'Межгородской'",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget1/sumToday", (req, res) => {
  db.get(
    "SELECT ROUND(SUM(Rings.amount_of_time * Tariffs.price),2) AS count FROM Rings JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE date(Rings.date_start) = date(?)",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget1/last_rings", (req, res) => {
  db.all("SELECT * FROM Rings ORDER BY ROWID DESC LIMIT 5", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

appp.get("/rings_widget2", (req, res) => {
  db.all(
    "SELECT strftime('%H:00', date_time_start) AS hour, type_ring, COUNT(*) AS call_count FROM Rings WHERE strftime('%H', date_time_start) BETWEEN '08' AND '17'  AND date(date_time_start) = date(?) AND time(date_time_start) >= '08:00:00' AND time(date_time_start) < '18:00:00' AND date(date_start) = date(?) GROUP BY hour, type_ring",
    [formattedDate, formattedDate],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(rows);
        console.log(rows);
      }
    }
  );
});
appp.get("/rings_widget3", (req, res) => {
  db.all(
    "SELECT strftime('%Y-%m', date_time_start) AS month, ROUND(SUM(Rings.amount_of_time * Tariffs.price),2) AS value FROM Rings JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE strftime('%Y', date_time_start) = strftime('%Y', 'now') GROUP BY month;",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(rows);
        console.log(rows);
      }
    }
  );
});
appp.get("/rings_widget4/callsCountTodayMobileUrbanIntercity", (req, res) => {
  db.all(
    "SELECT SUM(CASE WHEN type_ring = 'Мобильный' THEN 1 ELSE 0 END) AS mobile_count,SUM(CASE WHEN type_ring = 'Городской' THEN 1 ELSE 0 END) AS urban_count,SUM(CASE WHEN type_ring = 'Межгородской' THEN 1 ELSE 0 END) AS intercity_count FROM Rings WHERE strftime('%Y-%m', date_time_start) = strftime('%Y-%m', 'now')",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(rows);
      }
    }
  );
});
appp.get("/rings_widget4/callsCountMonth", (req, res) => {
  db.get(
    "SELECT COUNT(*) AS count FROM Rings WHERE strftime('%Y-%m', date_time_start) = strftime('%Y-%m', ?)",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});
appp.get("/rings_widget4/sumMonth", (req, res) => {
  db.get(
    "SELECT ROUND(SUM(Rings.amount_of_time * Tariffs.price),2) AS count FROM Rings JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE strftime('%Y-%m', Rings.date_start) = strftime('%Y-%m', ?)",
    [formattedDate],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ count: row.count });
      }
    }
  );
});

//--------------------------------------------REPORTS---------------------------------------------------------------------------

appp.get("/report_abonent", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (!startDate || !endDate) {
    db.all(
      "SELECT Rings.number_1 AS caller, Abonents.last_name AS caller_name, Rings.number_2 AS called_subscriber, SUM(Rings.amount_of_time) AS total_time, ROUND(SUM(Rings.amount_of_time * Tariffs.price), 2) AS total_price FROM Rings JOIN Abonents ON Rings.number_1 = Abonents.abonent_number JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE strftime('%Y-%m', date_time_start) = strftime('%Y-%m', ?) GROUP BY Rings.number_1 ORDER BY Rings.number_1;",
      [formattedDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("error");
        }
        res.json(rows);
      }
    );
  } else {
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
    db.all(
      "SELECT Rings.number_1 AS caller, Abonents.last_name AS caller_name, Rings.number_2 AS called_subscriber, SUM(Rings.amount_of_time) AS total_time, ROUND(SUM(Rings.amount_of_time * Tariffs.price), 2) AS total_price FROM Rings JOIN Abonents ON Rings.number_1 = Abonents.abonent_number JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE date(Rings.date_start) BETWEEN ? AND ? GROUP BY Rings.number_1 ORDER BY Rings.number_1;",
      [formattedStartDate, formattedEndDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("errdor");
        }

        res.json(rows);
      }
    );
  }
});
appp.get("/report_rings", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (!startDate || !endDate) {
    db.all(
      "SELECT Rings.date_start,Rings.number_1 AS caller, Abonents.last_name AS caller_name, Rings.number_2 AS called_subscriber, Rings.amount_of_time AS total_time , ROUND(Rings.amount_of_time * Tariffs.price, 2) AS total_price FROM Rings JOIN Abonents ON Rings.number_1 = Abonents.abonent_number JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE strftime('%Y-%m', date_time_start) = strftime('%Y-%m', ?) ORDER BY Rings.number_1, Rings.date_start; ",
      [formattedDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("error");
        }
        res.json(rows);
      }
    );
  } else {
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 10);
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 10);
    db.all(
      "SELECT Rings.date_start,Rings.number_1 AS caller, Abonents.last_name AS caller_name, Rings.number_2 AS called_subscriber, Rings.amount_of_time AS total_time , ROUND(Rings.amount_of_time * Tariffs.price, 2) AS total_price FROM Rings JOIN Abonents ON Rings.number_1 = Abonents.abonent_number JOIN Tariffs ON Rings.type_ring = Tariffs.description WHERE date(Rings.date_start) BETWEEN ? AND ? ORDER BY Rings.number_1, Rings.date_start;",
      [formattedStartDate, formattedEndDate],
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return console.log("errdor");
        }

        res.json(rows);
      }
    );
  }
});
//--------------------------------------------ТАБЛИЦЫ---------------------------------------------------------------------------------
// --- AllTables ---

// Получение всех данных из таблицы Аккаунты
appp.get("/allAccounts", (req, res) => {
  db.all("SELECT * FROM Accounts", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});
// Получение всех данных из таблицы Абоненты
appp.get("/allAbonents", (req, res) => {
  db.all("SELECT * FROM Abonents", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});
// Получение всех данных из таблицы Тарифы
appp.get("/allTariffs", (req, res) => {
  db.all("SELECT * FROM Tariffs", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

// --- Rings ---
// ADD
appp.post("/addRing", (req, res) => {
  const {
    date_start,
    date_time_start,
    amount_of_time,
    number_1,
    number_2,
    type_ring,
  } = req.body;
  const sql =
    "INSERT INTO Rings (date_start, date_time_start, amount_of_time, number_1, number_2, type_ring) VALUES (?, ?, ?, ?, ?, ?)";
  db.run(
    sql,
    [
      date_start,
      date_time_start,
      amount_of_time,
      number_1,
      number_2,
      type_ring,
    ],
    (err) => {
      if (err) {
        console.error("Error adding ring:", err);
        res.status(500).send("Error adding ring");
      } else {
        res.send({ id: this.lastID });
      }
    }
  );
});
// UPDATE
appp.put("/updateRing", (req, res) => {
  const {
    ring_id,
    date_start,
    date_time_start,
    amount_of_time,
    number_1,
    number_2,
    type_ring,
  } = req.body;
  const sql =
    "UPDATE Rings SET date_start = ?, date_time_start = ?, amount_of_time = ?, number_1 = ?, number_2 = ?, type_ring = ? WHERE ring_id = ?";
  db.run(
    sql,
    [
      date_start,
      date_time_start,
      amount_of_time,
      number_1,
      number_2,
      type_ring,
      ring_id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating ring:", err);
        res.status(500).send("Error updating ring");
      } else {
        res.send({ message: "Ring updated" });
      }
    }
  );
});

// --- Tariffs ---
// ADD
appp.post("/addTariff", (req, res) => {
  const { description, price } = req.body;
  const sql = "INSERT INTO Tariffs (description, price) VALUES (?, ?)";
  db.run(sql, [description, price], (err) => {
    if (err) {
      console.error("Error adding tariff:", err);
      res.status(500).send("Error adding tariff");
    } else {
      res.send({ id: this.lastID });
    }
  });
});
// UPDATE
appp.put("/updateTariff", (req, res) => {
  const { tariff_id, description, price } = req.body;
  const sql =
    "UPDATE Tariffs SET description = ?, price = ? WHERE tariff_id = ?";
  db.run(sql, [description, price, tariff_id], (err) => {
    if (err) {
      console.error("Error updating tariff:", err);
      res.status(500).send("Error updating tariff");
    } else {
      res.send({ message: "Tariff updated" });
    }
  });
});
// DELETE
appp.delete("/deleteTariff", (req, res) => {
  const { tariff_id } = req.body;
  const sql = "DELETE FROM Tariffs WHERE tariff_id = ?";
  db.run(sql, [tariff_id], (err) => {
    if (err) {
      console.error("Error deleting tariff:", err);
      res.status(500).send("Error deleting tariff");
    } else {
      res.send({ message: "Tariff deleted" });
    }
  });
});

// --- Abonents ---
// ADD
appp.post("/addAbonent", (req, res) => {
  const { last_name, abonent_number, convert_number } = req.body;
  const sql =
    "INSERT INTO Abonents (last_name, abonent_number, convert_number) VALUES (?, ?, ?)";
  db.run(sql, [last_name, abonent_number, convert_number], (err) => {
    if (err) {
      console.error("Error adding abonent:", err);
      res.status(500).send("Error adding abonent");
    } else {
      res.send({ message: "Abonent added" });
    }
  });
});
// UPDATE
appp.put("/updateAbonent", (req, res) => {
  const { abonent_id, last_name, abonent_number, convert_number } = req.body;
  const sql =
    "UPDATE Abonents SET last_name = ?, abonent_number = ?, convert_number = ? WHERE abonent_id = ?";
  db.run(
    sql,
    [last_name, abonent_number, convert_number, abonent_id],
    (err) => {
      if (err) {
        console.error("Error updating abonent:", err);
        res.status(500).send("Error updating abonent");
      } else {
        res.send({ message: "Abonent updated" });
      }
    }
  );
});
// DELETE
appp.delete("/deleteAbonent", (req, res) => {
  const { abonent_id } = req.body;
  const sql = "DELETE FROM Abonents WHERE abonent_id = ?";
  db.run(sql, [abonent_id], (err) => {
    if (err) {
      console.error("Error deleting abonent:", err);
      res.status(500).send("Error deleting abonent");
    } else {
      res.send({ message: "Abonent deleted" });
    }
  });
});

// --- Accounts ---
// ADD
appp.post("/addAccount", (req, res) => {
  const { login, password, level } = req.body;
  const sql = "INSERT INTO Accounts (login, password, hash) VALUES (?, ?, ?)";
  db.run(sql, [login, password, level], (err) => {
    if (err) {
      console.error("Error adding account:", err);
      res.status(500).send("Error adding account");
    } else {
      res.send({ id: this.lastID });
    }
  });
});
// UPDATE
appp.put("/updateAccount", (req, res) => {
  const { account_id, login, password, level } = req.body;
  const sql =
    "UPDATE Accounts SET login = ?, password = ?, hash = ? WHERE account_id = ?";
  db.run(sql, [login, password, level, account_id], (err) => {
    if (err) {
      console.error("Error updating account:", err);
      res.status(500).send("Error updating account");
    } else {
      res.send({ message: "Account updated" });
    }
  });
});
// DELETE
appp.delete("/deleteAccount", (req, res) => {
  const { account_id } = req.body;
  const sql = "DELETE FROM Accounts WHERE account_id = ?";
  db.run(sql, [account_id], (err) => {
    if (err) {
      console.error("Error deleting account:", err);
      res.status(500).send("Error deleting account");
    } else {
      res.send({ message: "Account deleted" });
    }
  });
});

// Запуск сервера
appp.listen(3001, () => {
  console.log("Сервер запущен на порту 3001");
});
