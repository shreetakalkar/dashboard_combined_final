import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import BgImg from '../../assets/image-illustrator.png';

const Background = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${BgImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const OTPContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: 400,
  width: '100%',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d81b60',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#ad1457',
  },
}));

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOTP = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/users/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <OTPContainer>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Verify OTP
        </Typography>
        <Typography variant="body2" textAlign="center" mb={3}>
          Enter the OTP sent to your email and set a new password.
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <TextField
            fullWidth
            label="Enter New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <SubmitButton
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying OTP...' : 'Reset Password'}
          </SubmitButton>
          {/* Back to Login */}
          <Typography
            variant="body2"
            textAlign="center"
            mt={2}
            sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#1976d2' }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Typography>
        </Box>
      </OTPContainer>
    </Background>
  );
}

export default VerifyOTP;
