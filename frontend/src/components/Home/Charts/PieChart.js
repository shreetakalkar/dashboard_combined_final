import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const dataConfig = {
  bargaining: {
    labels: ['Bargaining', 'Checkout'],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['#2FC2FF', '#8DA5FF'],
        borderWidth: 0,
      },
    ],
    legend: [
      { name: 'Bargaining', color: '#26C6DA' },
      { name: 'Checkout', color: '#7E9DDC' },
    ],
  },
  inventory: {
    labels: ['Shoes', 'Tops', 'Jeans', 'T-Shirts'],
    datasets: [
      {
        data: [25, 15, 20, 40],
        backgroundColor: ['#26C6DA', '#E91F63', '#344767', '#B0BEC5'],
        borderWidth: 0,
      },
    ],
    legend: [
      { name: 'Shoes', color: '#2FC2FF' },
      { name: 'Tops', color: '#FF4081' },
      { name: 'Jeans', color: '#3C4860' },
      { name: 'T-Shirts', color: '#A8B8D8' },
    ],
  },
};

const PieChart = ({ title, type, imgSrc, style }) => {
  const chartData = dataConfig[type];
  return (
    <Card
      sx={{
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Roboto'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px', 
            }}
          >
            <img
              src={imgSrc}
              alt="Icon"
              style={{
                ...style, // Dynamically apply the passed styles
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                padding: '4px',
              }}
            />
            <Typography variant="h6" color="#344767" style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              fontSize: '16px',
            }}>
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Content Section - Legend on Left, Pie Chart on Right */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
          {/* Legend Section - Left */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginRight: '16px', 
            }}
          >
            {chartData.legend.map((item, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: item.color,
                  marginBottom: '8px',
                }}
              >
                ● {item.name}
              </Typography>
            ))}
          </Box>

          {/* Chart Section - Right */}
          <Box
            sx={{
              height: '300px',
              width: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PieChart;
