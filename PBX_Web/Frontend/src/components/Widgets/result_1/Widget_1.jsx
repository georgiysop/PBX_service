import s from "../Widgets.module.css";
import React, { useEffect, useState } from "react";

export default function Widgets() {
  const [lastRings, setLastRings] = useState([]);
  const [count, setCount] = useState({
    count_today: null,
    count_Mobile: null,
    count_Urban: null,
    count_Intercity: null,
    count_sum: null,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const promises = [
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/callsCountToday`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/callsCountToday_Mobile`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/callsCountToday_Urban`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/callsCountToday_Intercity`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/sumToday`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/last_rings`
        ),
      ];

      Promise.all(promises)
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        .then((data) => {
          setCount({
            count_today: data[0].count,
            count_Mobile: data[1].count,
            count_Urban: data[2].count,
            count_Intercity: data[3].count,
            count_sum: data[4].count,
          });
        })
        .catch((error) => console.error("Error fetching counts:", error));

      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget1/last_rings`
      )
        .then((res) => res.json())
        .then((data) => setLastRings(data));
    }, 1000);

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);

  return (
    <div className={s.wrapper}>
      <div style={{ margin: 20 }}>
        <p
          style={{ fontSize: 19, margin: 0, marginBottom: 10, fontWeight: 700 }}
        >
          Звонков за день: {count.count_today}
        </p>
        <p style={{ fontSize: 19, margin: 0 }}>
          Мобильных: {count.count_Mobile}
        </p>
        <p style={{ fontSize: 19, margin: 0 }}>
          Городских: {count.count_Urban}
        </p>
        <p style={{ fontSize: 19, margin: 0 }}>
          Междугородних: {count.count_Intercity}
        </p>
        <hr></hr>
        <p
          style={{
            fontSize: 19,
            margin: 0,
            marginTop: 20,
            marginBottom: 20,
            fontWeight: 700,
          }}
        >
          Сумма за день: {count.count_sum} руб.
        </p>
        <hr></hr>
        <p style={{ fontSize: 19, margin: 0 }}>Последние номера:</p>

        {lastRings.map((ring, index) => (
          <p key={index} style={{ fontSize: 13, marginTop: 10 }}>
            Время: {ring.date_start} Кто: {ring.number_1} Кому: {ring.number_2}
          </p>
        ))}
        {/* <p style={{ fontSize: 13, marginTop: 10 }}>
          Время: 2024-03-21 11:50:41 Кто: 3419 Кому: 89211404678
        </p> */}
      </div>
    </div>
  );
}
