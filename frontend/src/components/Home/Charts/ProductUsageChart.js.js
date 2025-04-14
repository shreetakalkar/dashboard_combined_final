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

const ProductUsageChart = () => {
  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        label: "Product Usage",
        data: [50, 80, 300, 200, 500, 250, 400],
        backgroundColor: "#344767",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        barPercentage: 1, 
        categoryPercentage: 0.8, 
      },
      y: {
        min: 0,
        max: 500,
        ticks: {
          stepSize: 100,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProductUsageChart;

