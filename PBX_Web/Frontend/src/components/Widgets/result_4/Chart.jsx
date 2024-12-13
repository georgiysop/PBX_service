import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: [],
  datasets: [
    {
      label: "Сумма по месяцам",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)", // Customize line color
      fill: false,
      tension: 0.4, // Adjust line tension for smoother curves
    },
  ],
};

const options = {
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Value",
      },
    },
  },
};

const LineChart = () => {
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(
        `http://${process.env.REACT_APP_IP_BACKEND_SERVER}:3001/rings_widget3`
      )
        .then((res) => res.json())
        .then((data) => {
          const labels = data.map((monthData) => monthData.month);
          const values = data.map((monthData) => monthData.value);

          setChartData({
            labels: labels,
            datasets: [
              {
                ...chartData.datasets[0],
                data: values,
              },
            ],
          });
        })
        .catch((err) => console.error(err));
    }, 1000);
    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);
  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
