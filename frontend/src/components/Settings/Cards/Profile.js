import React, { useRef } from "react";
import { Box, Button, Typography, Avatar, Grid,} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from '@mui/icons-material/Home';
import Picture from '../../../assets/image-profilepic.png';

const Profile = () => {
  const accountRef = useRef(null);
  const pricingRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "900px",
        margin: "auto",
        fontFamily: 'sans-serif',
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={Picture}
            alt="Profile Picture"
            sx={{
              width: 80,
              height: 80,
              mr: 2,
            }}
          />
          <Typography color="#344767" sx={{ fontFamily: 'sans-serif', fontSize: '18px', fontWeight: "bold" }}>
            Company Name
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{ mr: 1 }}
          >
            Profile
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccountCircleIcon />}
            sx={{ mr: 1 }}
            onClick={() => scrollToSection(accountRef)}
          >
            Account
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => scrollToSection(pricingRef)}
          >
            Plans & Pricing
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography color="#344767" sx={{ mb: 1, fontFamily: 'sans-serif', fontSize: '18px', fontWeight: "bold" }}>
            Company Information
          </Typography>
          <Typography variant="h6" color="#7B809A" sx={{ mb: 2, fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
            Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} ref={accountRef}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="bold" color="#344767" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
              Profile Information
            </Typography>
          </Box>
          <Typography variant="body2" color="#344767" sx={{ mb: 1 }}>
            <strong>Full Name:</strong>{' '}
            <span style={{ color: '#7B809A' }}>Alec M. Thompson</span>
          </Typography>
        </Grid>
      </Grid>

      {/* Pricing Section */}
      <Box ref={pricingRef} sx={{ mt: 4 }}>
        <Typography color="#344767" sx={{ mb: 2, fontSize: '18px', fontWeight: "bold" }}>
          Plans & Pricing
        </Typography>
        <Typography variant="body2" color="#7B809A" sx={{ mb: 2 }}>
          Here are the details of our pricing plans.
        </Typography>
      </Box>

      {/* Update Information Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            px: 4,
          }}
        >
          Update Information
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
