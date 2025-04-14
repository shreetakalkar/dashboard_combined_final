import React from "react";
import { Box, Button, Card, CardContent, Typography, Divider, Chip} from "@mui/material";

const PlansAndPricing = () => {
  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "900px",
        margin: "auto",
        fontFamily: ' sans-serif',
        color: "#344767",
        
      }}
    >
      <Typography color="#344767" sx={{ fontFamily: ' sans-serif', fontSize: '18px', fontWeight: "bold" }}>
        Plans & Pricing
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start", 
          marginTop: "20px",
        }}
      >
        {/* Active Plan Details */}
        <Box
          sx={{
            flex: 1, 
            marginRight: "20px", 
          }}
        >
          <Chip
            label="Active Plan - Classic, $50 / month"
            sx={{
              backgroundColor: "#FF5B5B",
              color: "#fff",
              fontWeight: "bold",
              mb: 2, 
            }}
          />
          <Typography variant="body2" sx={{ mb: 1 ,color: "#6c757d"  }}>
            Last Subscribed: <strong>07th September, 2022</strong>
          </Typography>
          <Typography variant="body2"  sx={{ color: "#6c757d"  }}>
            Expires on: <strong>08th November, 2022</strong>
          </Typography>
        </Box>

        {/* Pricing Card */}
        <Card
          sx={{
            width: "300px", 
            borderRadius: "10px",
            boxShadow: 2,
            flexShrink: 0, 
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#6c757d",
                backgroundColor: "#F9F9F9",
                padding: "4px 10px",
                display: "inline-block",
                borderRadius: "8px",
              }}
            >
              Current Plan
            </Typography>
          </Box>

          <CardContent>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              $50<span style={{ fontSize: "16px" }}>/mo</span>
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ 2 team members
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ 20GB Cloud Storage
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ✓ Integration Help
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              – Sketch Files
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              – API Access
            </Typography>
            <Typography variant="body2" sx={{ color: "#6c757d" }}>
              – Complete Documentation
            </Typography>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 3,
                }}
              >
                Upgrade →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PlansAndPricing;
