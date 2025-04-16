import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@mui/material';

import ProductCategories from '../Inventory/Cards/ProductCategories';
import BargainingPriceRange from '../Inventory/Cards/BargainingPriceRange';
import CategorySettings from '../Inventory/Cards/CategorySettings';
import PullOutReason from '../Inventory/Cards/PullOutReason';
import InventoryTable from '../Inventory/Cards/InventoryTable';

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], metrics: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('http://localhost:5000/shopify/all-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch inventory data');
        }

        const inventoryData = await response.json();
        console.log('Fetched Inventory Data:', inventoryData);

        const allProducts = inventoryData?.data?.products || [];
        const categories = inventoryData?.data?.availableCategories || [];

        const activeProductCount = allProducts.filter(product => product.status === 'active').length;
        const inactiveProductCount = allProducts.length - activeProductCount;

        const metrics = [
          allProducts.length,        // Total Products
          activeProductCount,        // Active Products
          inactiveProductCount       // Inactive Products
        ];

        setData({ products: allProducts, categories, metrics });
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError(err.message || 'Failed to fetch inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  return (
    <Box
      sx={{
        padding: '20px 42px',
        marginTop: '64px',
        marginLeft: '191px',
        backgroundColor: '#F5F6FA',
        minHeight: '100vh',
        boxSizing: 'border-box',
        width: 'calc(100vw - 226px)',
        fontFamily: 'sans-serif',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" align="center" sx={{ marginTop: '20px', color: 'red' }}>
          {error}
        </Typography>
      ) : data.products.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ marginTop: '20px', color: 'gray' }}>
          No inventory data available.
        </Typography>
      ) : (
        <>
          {/* Metric Cards */}
          <Grid container spacing={2} sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>
{['Total Products', 'Active Products', 'Inactive Products', 'Total Available Products'].map((metric, index) => (
  <Grid item xs={12} sm={6} md={3} key={index}>
    <Card
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, color 0.3s',
        '&:hover': {
          backgroundColor: '#000',
          '& .hover-text': { color: '#fff' },
        },
      }}
    >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      className="hover-text"
                      sx={{ transition: 'color 0.3s' }}
                    >
                      {metric}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <Typography variant="h6" fontWeight="bold" className="hover-text" sx={{ transition: 'color 0.3s' }}>
                        {metric === 'Total Available Products' ? data.products.length : data.metrics[index] || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Sections */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <ProductCategories data={data.categories} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <BargainingPriceRange data={data.products} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <CategorySettings data={data.categories} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <PullOutReason data={data.products} />
            </Grid>

            <Grid item xs={12}>
              <InventoryTable data={data.products} />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Inventory;
