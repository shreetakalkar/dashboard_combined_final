import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import ShirtIcon from "../../../assets/Group 814.png";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch("http://localhost:5000/shopify/all-products-category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched Data:", result);

        const collections = result.data?.collections;
        if (collections && typeof collections === "object") {
          const categoriesArray = Object.entries(collections).flatMap(([key, items]) =>
            items.map((item) => ({
              id: item.id,
              title: item.name || key,
              totalProducts: item.inventory_quantity ?? 0,
              activeProducts: item.inventory_quantity > 0 ? item.inventory_quantity : 0,
              icon: ShirtIcon,
            }))
          );

          setTimeout(() => {
            setCategories(categoriesArray);
            setLoading(false);
          }, 1000);
        } else {
          throw new Error("Invalid data format: 'collections' is not an object.");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
        setTimeout(() => {
          setError(err.message);
          setLoading(false);
        }, 1000); 
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
         <div className="custom-loader"></div>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return <Typography color="error">No categories found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" color="#344767" sx={{ fontFamily: "sans-serif", fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Product Categories
      </Typography>
      <Grid container spacing={2}>
        {(showAll ? categories : categories.slice(0, 8)).map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
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
                  <img src={category.icon} alt={`${category.title} Icon`} style={{ width: "30px", height: "30px" }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {category.title}
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
