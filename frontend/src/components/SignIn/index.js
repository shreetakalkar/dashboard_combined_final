import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import BgImg from '../../assets/image-illustrator.png';

const Background = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${BgImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: 400,
  width: '100%',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d81b60',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#ad1457',
  },
}));

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const syncComplete = localStorage.getItem('syncComplete');
      setTimeout(() => {
        navigate(syncComplete ? '/' : '/shopify-sync', { replace: true });
      }, 500);
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      // Normalize email to lowercase before sending
      const normalizedEmail = email.trim().toLowerCase();

      console.log('Attempting login with:', { email: normalizedEmail, password: '****' });

      const response = await fetch('http://localhost:5000/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        const userRole = data?.data?.user?.role;
        const accessToken = data?.data?.accessToken;
        const shopifyShopName = data?.data?.user?.shopifyShopName || '';

        console.log('Login successful:', { userRole, hasAccessToken: !!accessToken });

        if (!userRole || !accessToken) {
          console.error('Missing role or token:', data);
          alert('Login failed: Missing role or token in response. Please try again.');
          return;
        }

        // Store token and Shopify shop name in localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('shopifyShopName', shopifyShopName);
        localStorage.removeItem('syncComplete');

        // Dispatch storage event for other tabs
        window.dispatchEvent(new Event('storage'));

        // Redirect based on role
        setTimeout(() => {
          if (userRole === 'ADMIN') {
            navigate('/admin-dashboard', { replace: true }); // Redirect to admin dashboard
          } else {
            navigate('/shopify-sync', { replace: true }); // Redirect to Shopify Sync
          }
        }, 500);
      } else {
        console.error('Login failed:', data);
        // Show more detailed error message
        if (data.message && data.message.includes('verify your email')) {
          alert('Your account is not verified. Please check your email for verification instructions.');
        } else {
          alert(data.message || 'Invalid credentials. Please check your email and password.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Network error or server not responding. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <LoginContainer>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          NeyX Dashboard Log In
        </Typography>
        <Typography variant="body2" textAlign="center" mb={3}>
          Enter your email and password to Sign In
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Current password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot the password?
            </Typography>
          </Box>
          <LoginButton
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
          <Typography
            variant="body2"
            textAlign="center"
            mt={2}
            sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#1976d2' }}
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Register
          </Typography>
        </Box>
      </LoginContainer>
    </Background>
  );
}

export default LoginPage;