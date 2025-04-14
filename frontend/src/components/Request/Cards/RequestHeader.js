import React from "react";
import { Card, CardContent, Box, Typography, Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PanToolIcon from "@mui/icons-material/PanTool";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const RequestHeader = () => {
  const stats = [
    { icon: <AccountCircleIcon fontSize="medium" />, title: "Request received", value: "1,600", change: "+55% than last week" },
    { icon: <PanToolIcon fontSize="medium" />, title: "Active Bargaining", value: "357", change: "+124% than last week" },
    { icon: <LocalMallIcon fontSize="medium" />, title: "Orders placed by Bot", value: "2,300", change: "+15% than last week" },
    { icon: <ThumbUpIcon fontSize="medium" />, title: "Discount generated", value: "940", change: "+90% than last week" }
  ];

  return (
    <Grid container spacing={1.5} justifyContent="center">
      {stats.map((stat, index) => (
        <Grid item key={index} xs={12} sm={6} md={6}>
          <Card 
            sx={{
              width: 200, 
              height: 110, 
              backgroundColor: "white",
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              mx: "auto",
              p: 1.3,
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", p: 0 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography color="primary">{stat.icon}</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: "right" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" textAlign="right">
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                width: 'calc(110% + 22px)',
                marginLeft: '-20px',
                height: "1px",
                backgroundColor: "#d3d3d3",
                marginBottom: "4px",
              }}
            />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
              <Box component="span" sx={{ color: stat.change.startsWith("+") ? "green" : "red" }}> 
                {stat.change.split("than")[0]} 
              </Box>{" "}
              <Box component="span" sx={{ color: "text.secondary", fontWeight: "normal" }}>
                than last week
              </Box>
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestHeader;


