import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import ShirtIcon from "../../../assets/Group 814.png";

const ProductCategories = ({ categories }) => {
  const [showAll, setShowAll] = useState(false);

  if (!Array.isArray(categories) || categories.length === 0) {
    return <Typography color="error">No categories found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" color="#344767" sx={{ fontFamily: "sans-serif", fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Product Categories
      </Typography>
      <Grid container spacing={2}>
        {(showAll ? categories : categories.slice(0, 8)).map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: "8px",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2} gap={1}>
                  <img src={ShirtIcon} alt={`${category.name} Icon`} style={{ width: "30px", height: "30px" }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {category.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "2px" }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Products
                  </Typography>
                  <Typography variant="h6">{category.totalProducts}</Typography>
                </Box>
                <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", margin: "0", width: "100%" }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px" }}>
                  Active: <span style={{ fontWeight: "bold", color: "black", fontSize: "14px" }}>{category.activeProducts}</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="primary" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "View All Categories"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCategories;
