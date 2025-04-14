import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfitsChart = () => {
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Profits",
        data: [12, 15, 10, 55, 20, 18, 22],
        backgroundColor: "#344767",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 60,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProfitsChart;
