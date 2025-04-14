// src/chartConfig.js

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement, 
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  // Register the components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement, 
    Title,
    Tooltip,
    Legend
  );
  