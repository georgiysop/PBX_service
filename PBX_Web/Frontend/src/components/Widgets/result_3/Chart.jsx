import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RingChart = ({ chartData }) => {
  return (
    <div>
      <Pie
        data={chartData}
        width={300}
        height={300}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};

export default RingChart;
