import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: '#f0f4ff',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: '8px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#6c63ff',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5a54e3',
  },
}));

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Ensure email is retrieved from state
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is missing. Please try registering again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/verify-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.status === 200) {
        console.log('OTP verified successfully');
        navigate('/login'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container>
      <StyledCard>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            OTP Verification
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            marginBottom={2}
          >
            We've sent a verification code to your email -
            <br />
            <strong>{email || 'Unknown Email'}</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter verification code"
              variant="outlined"
              value={otp}
              onChange={handleOtpChange}
              required
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                marginTop={1}
              >
                {error}
              </Typography>
            )}
            <SubmitButton
              fullWidth
              variant="contained"
              size="large"
              type="submit"
            >
              Submit
            </SubmitButton>
          </form>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default OTPVerification;