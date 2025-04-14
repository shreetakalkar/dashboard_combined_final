import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Chart Data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'User Activity',
        data: [33, 53, 85, 41, 44], 
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)', 
        borderColor: 'rgba(75,192,192,1)', 
        pointRadius: 5, 
        pointBackgroundColor: 'rgba(75,192,192,1)', 
        tension: 0.4, 
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity Over Time',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: { weight: 'bold' },
        },
      },
      y: {
        beginAtZero: true, 
        title: {
          display: true,
          text: 'Activity Level',
          font: { weight: 'bold' },
        },
      },
    },
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',       
        height: '400px',     
        margin: '0 auto',
        fontFamily: 'Roboto'     
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
