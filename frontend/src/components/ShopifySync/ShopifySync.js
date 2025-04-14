import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
    TextField,
} from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
}));

const Card = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    width: '100%',
}));

const SyncButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#d81b60',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#ad1457',
    },
    '&.Mui-disabled': {
        backgroundColor: '#e0e0e0',
    },
}));

function ShopifySync() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncComplete, setSyncComplete] = useState(false);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [shopifyCredentials, setShopifyCredentials] = useState({
        accessToken: '',
        shopifyShopName: '',
        apiVersion: '2024-01',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShopifyCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setError('');

        try {
            // Save Shopify credentials
            const credentialsResponse = await fetch('http://localhost:5000/shopify/set-shopify-cred', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopifyCredentials),
            });

            const credentialsData = await credentialsResponse.json();

            if (!credentialsResponse.ok) {
                throw new Error(credentialsData.message || 'Failed to save Shopify credentials');
            }

            // Fetch products to verify connection
            const productsResponse = await fetch('http://localhost:5000/shopify/all-products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            const productsData = await productsResponse.json();

            if (!productsResponse.ok) {
                throw new Error(productsData.message || 'Failed to sync products');
            }

            // Success handling
            setSyncComplete(true);
            localStorage.setItem('syncComplete', 'true');
            setOpenSnackbar(true);

            // Redirect to inventory after a short delay
            setTimeout(() => {
                navigate('/inventory', { replace: true });
            }, 1000);
        } catch (error) {
            console.error('Sync error:', error);
            setError(error.message || 'Failed to connect to Shopify. Please check your credentials.');
            setOpenSnackbar(true);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const isFormValid =
        shopifyCredentials.shopifyShopName &&
        shopifyCredentials.accessToken &&
        shopifyCredentials.apiVersion;

    useEffect(() => {
        const updateShopName = () => {
            const storedShopName = localStorage.getItem('shopifyShopName') || '';
            setShopifyCredentials((prev) => ({
                ...prev,
                shopifyShopName: storedShopName,
            }));
        };

        updateShopName();

        window.addEventListener('storage', updateShopName);
        return () => {
            window.removeEventListener('storage', updateShopName);
        };
    }, []);

    return (
        <Container>
            <Card>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    textAlign="center"
                    mb={2}
                >
                    Connect Your Shopify Store
                </Typography>
                <Typography
                    variant="body2"
                    textAlign="center"
                    mb={3}
                    color="text.secondary"
                >
                    Please enter your Shopify store details to continue
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Shop Name"
                        name="shopifyShopName"
                        placeholder="your-store-name"
                        helperText="Enter only the store name (without .myshopify.com)"
                        value={shopifyCredentials.shopifyShopName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Access Token"
                        name="accessToken"
                        type="password"
                        value={shopifyCredentials.accessToken}
                        onChange={handleInputChange}
                        helperText="Enter your Shopify Admin API access token"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="API Version"
                        name="apiVersion"
                        placeholder="e.g., 2024-01"
                        value={shopifyCredentials.apiVersion}
                        onChange={handleInputChange}
                        helperText="Enter the Shopify API version"
                    />

                    <Box mt={3}>
                        <SyncButton
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSync}
                            disabled={isSyncing || !isFormValid}
                        >
                            {isSyncing ? (
                                <>
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                        sx={{ mr: 1 }}
                                    />
                                    Connecting...
                                </>
                            ) : syncComplete ? (
                                "Connected Successfully"
                            ) : (
                                "Connect & Sync"
                            )}
                        </SyncButton>
                    </Box>
                </Box>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={error ? 'error' : 'success'}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {error || 'Successfully connected to Shopify!'}
                    </Alert>
                </Snackbar>
            </Card>
        </Container>
    );
}

export default ShopifySync;