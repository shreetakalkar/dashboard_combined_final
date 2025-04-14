import React from 'react';
import { Box, Button, TextField, Typography, MenuItem, Checkbox, FormControlLabel, Grid } from '@mui/material';

const productCategories = [
  'Baby Products',
  'Beauty',
  'Educational Supplies',
  'Books',
  'Office Supplies',
  'Clothing',
  'Sunglasses and Fashion Eyewear',
  'Health and Personal Care',
  'Jewellery',
  'Pet Supplies',
  'Shoes & Accessories',
  'Sport',
  'Toys',
  'Other',
];

const CompanyDetails = ({ handleNext, formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (category) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(item => item !== category)
      : [...formData.categories, category];

    updateFormData({ categories: newCategories });
  };

  const handleSubmit = () => {
    handleNext();
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
          mb: 2,
        }}
      >
        Company Details
      </Typography>
      <Box component="form">
        {/* First Row */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Company Name
            </Typography>
            <TextField
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Company Website
            </Typography>
            <TextField
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Second Row */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Employee Size
            </Typography>
            <TextField
              name="employeeSize"
              value={formData.employeeSize}
              onChange={handleChange}
              select
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            >
              <MenuItem value="1-10">1-10</MenuItem>
              <MenuItem value="11-55">11-55</MenuItem>
              <MenuItem value="56-200">56-200</MenuItem>
              <MenuItem value="201+">201+</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Company LinkedIn URL
            </Typography>
            <TextField
              name="linkedInUrl"
              value={formData.linkedInUrl}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Product Categories */}
        <Box sx={{ mt: 2 }}>
          <Typography>Select the kinds of product categories you have:</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {productCategories.map((category, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCheckboxChange(category)}
                    />
                  }
                  label={category}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Third Row */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Country
            </Typography>
            <TextField
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              State
            </Typography>
            <TextField
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              City
            </Typography>
            <TextField
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#4F46BA' },
                  '&.Mui-focused fieldset': { borderColor: '#4F46BA' },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#4F46BA',
              '&:hover': { backgroundColor: '#3E3A9F' },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyDetails;