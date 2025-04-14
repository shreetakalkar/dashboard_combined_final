import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ShirtIcon from '../../../assets/Group 814.png';

const PullOutReason = () => {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5000/shopify/all-products-category", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      const collections = result.data?.collections;
      if (collections && typeof collections === "object") {
        const categoriesArray = Object.entries(collections).flatMap(([key, items]) =>
          items.map(item => ({
            id: item.id,
            title: item.name || key,
            totalProducts: item.inventory_quantity ?? 0,
            activeProducts: item.inventory_quantity > 0 ? item.inventory_quantity : 0,
            icon: ShirtIcon,
          }))
        );

        setCategories(categoriesArray);
      } else {
        throw new Error("Invalid data format: 'collections' is not an object.");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      showAlert(err.message, 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAllProductsInactive = async (e) => {
    e.preventDefault();
    if (!reason) {
      showAlert("Please select a reason", 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(" http://localhost:5000/bargaining/deactivate-all", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deactivate products");
      }

      // const result = await response.json();
      // showAlert("All products marked as inactive", 'success');

      setCategories(prevCategories =>
        prevCategories.map(category => ({
          ...category,
          activeProducts: 0
        }))
      );

      setReason('');
    } catch (err) {
      console.error("Error:", err);
      showAlert(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCategoryInactive = async (e) => {
    e.preventDefault();
    if (!category || !reason) {
      showAlert("Please select both category and reason", 'error');
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === category);
    if (!selectedCategory) {
      showAlert("Invalid category selected", 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:8000/api/v1/bargaining/deactivate-category", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category: selectedCategory.title,
          reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deactivate category");
      }

      const result = await response.json();
      showAlert(result.message || "Category products marked as inactive", 'success');
      setCategory('');
      setReason('');
    } catch (err) {
      console.error("Error:", err);
      showAlert(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = [
    { value: 'outOfStock', label: 'Out of Stock' },
    { value: 'discontinued', label: 'Discontinued' },
    { value: 'seasonal', label: 'Seasonal End' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
         <div className="custom-loader"></div>
      </Box>
    );
  }

  return (
    <Box mt={1}>
    <Card
      sx={{
        width: '96%',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >

        <Typography className="text-lg font-bold mb-6">Pull out NeyX</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography className="mb-2">For All Products</Typography>
            <Box display="flex" gap={2}>
              <TextField
                select
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                label="Select Reason"
              >
                <MenuItem value="">Select Reason</MenuItem>
                {reasons.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={handleAllProductsInactive}
                variant="contained"
                color="primary"
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className="mb-2">For Selected Categories</Typography>
            <Box display="flex" gap={2}>
              <TextField
                select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                label="Select Category"
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.title} ({cat.activeProducts}/{cat.totalProducts})
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={handleCategoryInactive}
                variant="contained"
                color="primary"
                disabled={isSubmitting || !category || !reason}
              >
                {isSubmitting ?  <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PullOutReason;