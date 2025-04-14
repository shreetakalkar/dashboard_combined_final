import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, MenuItem } from '@mui/material';
import Header from '../Header'; // Import the Header component

const RenderStep3 = ({ formData, handleBack, handleSubmit, updateFormData, loading }) => {
    const [errors, setErrors] = useState({});

    // Validation function
    const validateField = (name, value) => {
        let error = '';
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Enter a valid email address';
            }
        }
        if (name === 'contactNumber' && value) {
            if (!/^\d{10,}$/.test(value)) {
                error = 'Contact number must be at least 10 digits';
            }
        }
        if (name === 'linkedIn' && value) {
            const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
            if (!linkedInRegex.test(value)) {
                error = 'Enter a valid LinkedIn URL';
            }
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
        validateField(name, value);
    };

    const isFormValid = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'contactNumber', 'designation', 'linkedIn'];
        const newErrors = {};

        for (const field of requiredFields) {
            const value = formData[field];
            if (!value) {
                newErrors[field] = 'This field is required';
            } else {
                const error = validateField(field, value);
                if (error) {
                    newErrors[field] = error;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
        if (isFormValid()) {
            handleSubmit();
        } else {
            alert('Please fill out all fields correctly.');
        }
    };

    return (
        <Box sx={{ pb: 4, px: { xs: 2, md: 8 } }}>
            {/* Add Header here */}
            <Header />

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
                Personal Details
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    {/* First Name */}
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ mb: 1 }}>First Name</Typography>
                        <TextField
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ mb: 1 }}>Last Name</Typography>
                        <TextField
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                        <Typography sx={{ mb: 1 }}>Business Email ID</Typography>
                        <TextField
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>

                    {/* Contact Number */}
                    <Grid item xs={12}>
                        <Typography sx={{ mb: 1 }}>Contact Number</Typography>
                        <TextField
                            name="contactNumber"
                            value={formData.contactNumber || ''}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.contactNumber}
                            helperText={errors.contactNumber}
                            required
                        />
                    </Grid>

                    {/* Designation */}
                    <Grid item xs={12}>
                        <Typography sx={{ mb: 1 }}>Designation</Typography>
                        <TextField
                            name="designation"
                            value={formData.designation || ''}
                            onChange={handleChange}
                            select
                            fullWidth
                            error={!!errors.designation}
                            helperText={errors.designation}
                        >
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Developer">Developer</MenuItem>
                            <MenuItem value="Designer">Designer</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                    </Grid>

                    {/* LinkedIn URL */}
                    <Grid item xs={12}>
                        <Typography sx={{ mb: 1 }}>LinkedIn URL</Typography>
                        <TextField
                            name="linkedIn"
                            value={formData.linkedIn || ''}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.linkedIn}
                            helperText={errors.linkedIn}
                        />
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleBack}
                        sx={{ backgroundColor: '#4F46BA' }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleFormSubmit}
                        disabled={loading}
                        sx={{ backgroundColor: '#4F46BA' }}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RenderStep3;
