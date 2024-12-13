import s from "../Widgets.module.css";
import BarChart from "./Chart";
import { useState, useEffect } from "react";

export default function Widgets() {
  const [count, setCount] = useState({
    count_bytypeMonth: null,
    count_sumMonth: null,
  });
  const [userData, setUserData] = useState({
    labels: ["Мобильные", "Городские", "Межгородские"], //  Инициализируем labels
    datasets: [
      { label: "Количество звонков", data: [0, 0, 0] }, // Инициализируем data
    ],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget4/callsCountTodayMobileUrbanIntercity`
      )
        .then((res) => res.json())
        .then((data) => {
          // Извлекаем данные из ответа сервера
          const mobileCount = data[0].mobile_count;
          const urbanCount = data[0].urban_count;
          const intercityCount = data[0].intercity_count;

          // Обновляем состояние с данными
          setUserData({
            ...userData,
            datasets: [
              {
                label: "Количество звонков",
                data: [mobileCount, urbanCount, intercityCount],
              },
            ],
          });
        });

      const promises = [
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget4/callsCountMonth`
        ),
        fetch(
          `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget4/sumMonth`
        ),
      ];

      Promise.all(promises)
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        .then((data) => {
          setCount({
            count_bytypeMonth: data[0].count,
            count_sumMonth: data[1].count,
          });
        })
        .catch((error) => console.error("Error fetching counts:", error));
    }, 1000); // Запрос выполняется только один раз при монтировании компонента
    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);
  return (
    <div className={s.wrapper}>
      <BarChart chartData={userData} />
      <div style={{ margin: 20 }}>
        <p style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>
          Звонков за месяц: {count.count_bytypeMonth}
        </p>
        <p
          style={{
            fontSize: 19,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Сумма за месяц: {count.count_sumMonth} руб.
        </p>
      </div>
    </div>
  );
}
