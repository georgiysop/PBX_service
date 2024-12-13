import React, { useEffect, useState } from "react";
import s from "../Widgets.module.css";
import BarChart from "./Chart";

export default function Widgets() {
  const [timeData, setTimeData] = useState({
    labels: [],
    datasets: [
      { label: "Мобильные", data: [] },
      { label: "Межгородские", data: [] },
      { label: "Городские", data: [] },
    ],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget2`
      )
        .then((res) => res.json())
        .then((data) => {
          // 1. Создаем объект для агрегирования данных по часам
          const aggregatedData = {};

          // 2. Итерируем по данным, полученным из API
          data.forEach((item) => {
            const hour = item.hour;

            // 3. Если час уже есть в объекте, то добавляем количество звонков к существующим значениям
            if (aggregatedData[hour]) {
              if (item.type_ring === "Мобильный") {
                aggregatedData[hour].mobile += item.call_count;
              } else if (item.type_ring === "Межгородской") {
                aggregatedData[hour].intercity += item.call_count;
              } else if (item.type_ring === "Городской") {
                aggregatedData[hour].urban += item.call_count;
              }
            } else {
              // 4. Если час еще не существует в объекте, то создаем запись для этого часа
              aggregatedData[hour] = {
                mobile: 0,
                intercity: 0,
                urban: 0,
              };
              if (item.type_ring === "Мобильный") {
                aggregatedData[hour].mobile += item.call_count;
              } else if (item.type_ring === "Межгородской") {
                aggregatedData[hour].intercity += item.call_count;
              } else if (item.type_ring === "Городской") {
                aggregatedData[hour].urban += item.call_count;
              }
            }
          });

          // 5. Преобразуем данные из объекта в массивы для диаграммы
          const labels = Object.keys(aggregatedData);
          const mobileData = labels.map((hour) => aggregatedData[hour].mobile);
          const intercityData = labels.map(
            (hour) => aggregatedData[hour].intercity
          );
          const urbanData = labels.map((hour) => aggregatedData[hour].urban);

          // 6. Обновляем состояние с агрегированными данными
          setTimeData({
            labels: labels,
            datasets: [
              { label: "Мобильные", data: mobileData },
              { label: "Межгородские", data: intercityData },
              { label: "Городские", data: urbanData },
            ],
          });
        })
        .catch((error) => console.error(error));
    }, 1000);
    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);
  return (
    <div className={`${s.wrapper} ${s.graf}`}>
      <BarChart chartData={timeData} />
    </div>
  );
}
