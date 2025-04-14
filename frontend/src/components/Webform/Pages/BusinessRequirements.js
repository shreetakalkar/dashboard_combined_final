import React from 'react';
import { Box, Button, Typography, Slider, Grid } from '@mui/material';

const BusinessRequirements = ({ handleNext, handleBack, formData, updateFormData }) => {
  const handleSliderChange = (name) => (event, newValue) => {
    updateFormData({ [name]: newValue });
  };

  return (
    <Box sx={{ pb: 4, px: { xs: 2, md: 8 } }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'sans-serif',
          fontSize: { xs: '24px', md: '30px' },
          fontWeight: '600',
          textAlign: 'center',
          mt: 3,
        }}
      >
        Business Requirements
      </Typography>
      <Box sx={{ mt: 2, fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal' }}>
        {/* Monthly Orders Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography
            gutterBottom
            sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 500 }}
          >
            How many monthly orders do you handle?
          </Typography>
          <Slider
            value={formData.monthlyOrders}
            onChange={handleSliderChange('monthlyOrders')}
            step={10}
            min={0}
            max={500}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Inventory Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography
            gutterBottom
            sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 500 }}
          >
            How many products do you have in your inventory?
          </Typography>
          <Slider
            value={formData.inventorySize}
            onChange={handleSliderChange('inventorySize')}
            step={10}
            min={0}
            max={500}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Customers Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography
            gutterBottom
            sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 500 }}
          >
            How many customers do you have?
          </Typography>
          <Slider
            value={formData.customerCount}
            onChange={handleSliderChange('customerCount')}
            step={10}
            min={0}
            max={500}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Revenue Slider */}
        <Box sx={{ mb: 3 }}>
          <Typography
            gutterBottom
            sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 500 }}
          >
            What is your annual revenue?
          </Typography>
          <Slider
            value={formData.annualRevenue}
            onChange={handleSliderChange('annualRevenue')}
            step={5000}
            min={0}
            max={100000}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              backgroundColor: '#4F46BA',
              '&:hover': { backgroundColor: '#3E3A9F' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundColor: '#4F46BA',
              '&:hover': { backgroundColor: '#3E3A9F' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessRequirements;