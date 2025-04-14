import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend);

const UserUsageChart = () => {
  const data = {
    labels: ['11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
    datasets: [
      {
        label: 'Usage',
        data: [50, 300, 250, 400, 500, 300, 350],
        borderColor: '#FF3D57',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
    },
    scales: {
      x: {
        ticks: { color: '#A0AEC0' },
      },
      y: {
        ticks: { color: '#A0AEC0' },
      },
    },
  };

  return (
    <div style={{ width: '90%', height: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserUsageChart;
