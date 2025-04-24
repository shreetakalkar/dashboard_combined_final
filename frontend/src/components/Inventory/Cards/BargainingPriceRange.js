import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from "@mui/material";
import axios from "axios";

const BargainingPriceRange = ({ data }) => {
  const [bargaining, setBargaining] = useState("Normal");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPricePercentage, setMinPricePercentage] = useState(20);
  const [setForAll, setSetForAll] = useState(false);
  const [noOfProducts, setNoOfProducts] = useState("");
  const [loading, setLoading] = useState(false);
  const [minPriceLimit, setMinPriceLimit] = useState(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000);

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate min and max prices from the actual product data
      const prices = data.map(product => {
        // product.price is now a number, so no need to replace
        return product.price || 0;
      });
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      setMinPriceLimit(minPrice);
      setMaxPriceLimit(maxPrice);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [data]);

  const handlePriceChange = (event, newValue) => {
    // Ensure the slider can't go below min or above max
    const clampedValue = [
      Math.max(newValue[0], minPriceLimit),
      Math.min(newValue[1], maxPriceLimit)
    ];
    setPriceRange(clampedValue);
  };

  const handleBargainingChange = (event, newBargaining) => {
    if (newBargaining !== null) setBargaining(newBargaining);
  };

  const handleSwitchChange = (event) => {
    const checked = event.target.checked;
    setSetForAll(checked);
    if (checked) {
      setNoOfProducts("");
    }
  };

  const handleProductChange = (event) => {
    if (!setForAll) {
      setNoOfProducts(event.target.value);
    }
  };

  const handleMinPricePercentageChange = (event) => {
    const value = event.target.value;
    if (value === "" || (/^\d+(\.\d{0,2})?$/.test(value) && Number(value) >= 0)) {
      setMinPricePercentage(value);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication token is missing!");
        setLoading(false);
        return;
      }

      const discount = Number(minPricePercentage);
      if (isNaN(discount) || discount < 0) {
        alert("Please enter a valid min price percentage");
        setLoading(false);
        return;
      }

      const payload = {
        minPricePercentage: discount.toString(),
        startRange: Number(priceRange[0]),
        endRange: Number(priceRange[1]),
        noOfProducts: noOfProducts,
        isProductAll: setForAll,
        bargainingBehaviour: bargaining.toLowerCase()
      };

      const response = await fetch("http://localhost:5000/bargaining/set-all-products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to set bargaining details");
      }

      alert("Bargaining details set successfully!");

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ 
        width: "100%", 
        maxWidth: "900px", 
        backgroundColor: "transparent", 
        boxShadow: "none", 
        fontFamily: 'sans-serif' 
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography color="#344767" fontWeight="bold" sx={{ 
              fontFamily: 'sans-serif', 
              fontWeight: 'bold', 
              fontSize: '18px', 
              mb: 2 
            }}>
              For all the products
            </Typography>
            <Typography variant="subtitle2">
              Set the minimum and maximum values for all the products.
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="h6" fontWeight="bold" sx={{ mr: 4 }}>
              Bargaining behaviour
            </Typography>
            <ToggleButtonGroup 
              value={bargaining} 
              exclusive 
              onChange={handleBargainingChange} 
              sx={{ 
                mt: 2, 
                gap: 2,
                "& .MuiToggleButton-root": {
                  borderRadius: "8px",
                  textTransform: "none",
                  padding: "6px 16px",
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                },
              }}
            >
              <ToggleButton value="Low">Low</ToggleButton>
              <ToggleButton value="Normal">Normal</ToggleButton>
              <ToggleButton value="High">High</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Set the min price percentage (%)
            </Typography>
            <TextField
              type="number"
              fullWidth
              label="Min Price Percentage"
              value={minPricePercentage}
              onChange={handleMinPricePercentageChange}
              inputProps={{ 
                min: 0, 
                max: 100, 
                step: 0.01 
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} sx={{ mt: -4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Changing max price is unavailable right now
            </Typography>
            <TextField 
              label="Same as product price" 
              disabled 
              fullWidth 
              sx={{ 
                backgroundColor: "#D9D9D9",
                "& .MuiInputBase-root": {
                  backgroundColor: "#D9D9D9",
                },
              }} 
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={setForAll}
                  onChange={handleSwitchChange}
                />
              }
              label="Set for all products"
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="body1">
                  Select products up to:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  type="number"
                  size="small"
                  value={noOfProducts}
                  onChange={handleProductChange}
                  style={{ width: 120 }}
                  disabled={setForAll}
                  inputProps={{
                    min: 1,
                    step: 1
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box mt={1}>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            Select products priced between
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              width: "30%", 
              marginLeft: "2%" 
            }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={minPriceLimit}
                max={maxPriceLimit}
                step={1}
                sx={{ width: "100%" }}
                disabled={setForAll}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  ${priceRange[0].toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  ${priceRange[1].toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: "#000", 
                padding: "6px 20px", 
                color: "#fff", 
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }} 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default BargainingPriceRange;