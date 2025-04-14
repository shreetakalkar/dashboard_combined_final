import React from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Grid } from '@mui/material';
import Header from './Header'; 

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

const RenderStep1 = ({ formData, handleInputChange, handleKindsOfProductsChange, nextStep }) => {
    return (
        <Box>
            {/* Header Component */}
            <Header />

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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                Company LinkedIn URL
                            </Typography>
                            <TextField
                                name="companyLinkedInUrl"
                                value={formData.companyLinkedInUrl}
                                onChange={handleInputChange}
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
                                                checked={formData.kindsOfProducts.includes(category)}
                                                onChange={(e) => handleKindsOfProductsChange(e)}
                                                value={category}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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

                    <Button
                        variant="contained"
                        sx={{ mt: 2, bgcolor: '#4F46BA', color: 'white' }}
                        onClick={nextStep}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RenderStep1;
