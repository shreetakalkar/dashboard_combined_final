import React from "react";
import { Box, Card, CardContent, Typography, Button, } from "@mui/material";
import Profile from "../Settings/Cards/Profile";
import Account from "../Settings/Cards/Account";
import PricingAndPlans from "./Cards/PricingAndPlans";

const Settings = () => {
  return (
    <Box
      sx={{
        padding: '20px 42px', 
        margin: 0,
        marginTop: '64px',
        marginLeft: '191px', 
        backgroundColor: '#F5F6FA',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden', 
        width: 'calc(101vw - 226px)',
      }}
    >

      {/* Profile Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Profile />
        </CardContent>
      </Card>

      {/* Account Settings Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Account />
        </CardContent>
      </Card>

      {/* Plans and Pricing Card */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <PricingAndPlans />
        </CardContent>
      </Card>

      {/* Delete Subscription Section */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }} >
      <Box
          sx={{
            width: "100%",
            maxWidth: "900px", 
            margin: "auto",
            p: 3,
            fontFamily: 'sans-serif'
          }}
        >
          <Typography  color="#344767" sx={{ mb: 2, fontFamily: ' sans-serif',fontSize: '16px',fontWeight: "bold" }}>
            Delete Subscription
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#6c757d" }}>
            Once you delete your account, there is no going back. Please be
            certain.
          </Typography>
          <Box sx={{  mx: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
              }}
            >
              Deactivate
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Settings;
