import React from 'react';
import { Line } from 'react-chartjs-2';
import MapImg from '../../../assets/map.png';
import Group from '../../../assets/Group.png';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Line Chart Data
const lineChartData = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [
    {
      label: 'With Bot',
      data: [50, 100, 300, 500, 600, 700, 650],
      borderColor: '#E91E63',
      backgroundColor: 'rgba(233, 30, 99, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Without Bot',
      data: [10, 50, 100, 150, 200, 300, 400],
      borderColor: '#3F51B5',
      backgroundColor: 'rgba(63, 81, 181, 0.2)',
      tension: 0.4,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Geographical Data
const countryData = [
  {
    country: 'United States',
    sales: 2500,
    value: '$230,900',
    bounce: '29.9%',
    icon: 'https://flagcdn.com/us.svg', 
  },
  {
    country: 'Germany',
    sales: 3900,
    value: '$440,000',
    bounce: '40.22%',
    icon: 'https://flagcdn.com/de.svg',
  },
  {
    country: 'Great Britain',
    sales: 1400,
    value: '$190,700',
    bounce: '23.44%',
    icon: 'https://flagcdn.com/gb.svg',
  },
  {
    country: 'Brazil',
    sales: 562,
    value: '$143,960',
    bounce: '32.14%',
    icon: 'https://flagcdn.com/br.svg',
  },
];

const Simplemap = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="#344767" sx={{ fontFamily: 'Roboto, sans-serif',fontWeight: 'bold',fontSize: '16px' }} >Bot vs Without Bot Orders</Typography>
                <Select defaultValue="Daily" size="small">
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </Box>
              <Box
                sx={{
                  height: '300px', 
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Line
                  data={lineChartData}
                  options={{
                    ...lineChartOptions,
                    maintainAspectRatio: false, 
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={Group}
                  alt="Product Icon"
                  style={{
                    width: '16px',
                    height: '16px',
                    padding: '10px',
                    borderRadius: '4px',
                    display: 'block',
                    backgroundColor: '#4BA64F',
                  }}
                />
                <Typography variant="h6" color="#344767" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif',fontWeight: 'bold',fontSize: '16px' }}>
                  Geographical
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {/* Country Table */}
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Country</TableCell>
                          <TableCell>Sales</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Bounce</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {countryData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <img
                                  src={row.icon}
                                  alt={`${row.country} Flag`}
                                  style={{
                                    width: '24px',
                                    height: '16px',
                                    borderRadius: '2px',
                                  }}
                                />
                                {row.country}
                              </Box>
                            </TableCell>
                            <TableCell>{row.sales}</TableCell>
                            <TableCell>{row.value}</TableCell>
                            <TableCell>{row.bounce}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                {/* World Map */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: '200px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={MapImg}
                      alt="World Map"
                      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simplemap;