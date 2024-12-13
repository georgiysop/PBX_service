import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({ chartData }) => {
  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
