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
  Button,
  FormControl, 
  Select, 
  MenuItem,
} from "@mui/material";

const CategorySettings = ({ 
  priceRange, 
  setPriceRange, 
  category, 
  setCategory, 
  data, 
  minPriceBound, 
  maxPriceBound,
  categoryPriceRanges,
  minPricePerCategory
}) => {
  const [bargaining, setBargaining] = useState("Normal");
  const [minPrice, setMinPrice] = useState(0);
  const [setForAll, setSetForAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [percentages, setPercentages] = useState({ increase: "+2.7%", decrease: "-2.7%" });
  const [editing, setEditing] = useState(null);
  const [newPercentage, setNewPercentage] = useState("");
  const [noOfproducts, setNoOfProducts] = useState("");
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setCategories(data.map(cat => cat.name || cat));
    }
  }, [data]);

  useEffect(() => {
    if (category && categoryPriceRanges[category]) {
      const range = categoryPriceRanges[category];
      setLocalPriceRange([range.min, range.max]);
      setMinPrice(minPricePerCategory[category] || 0);
    } else if (category === "") {
      setLocalPriceRange([minPriceBound, maxPriceBound]);
      setMinPrice(0);
    }
  }, [category, categoryPriceRanges, minPriceBound, maxPriceBound, minPricePerCategory]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  };

  const handlePriceChange = (event, newValue) => {
    console.log("Slider value changed:", newValue);
    setLocalPriceRange(newValue);
  };

  const handleBargainingChange = (event, newBargaining) => {
    if (newBargaining !== null) setBargaining(newBargaining);
  };

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setSetForAll(isChecked);
    if (isChecked) {
      setNoOfProducts("0");
    }
  };

  const handleProductChange = (event) => {
    if (!setForAll) {
      setNoOfProducts(event.target.value);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!category) {
        alert("Please select a category");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication token missing");
        setLoading(false);
        return;
      }

      // Use minPrice state instead of fixed discount
      const payload = {
        category,
        minPrice: minPrice.toString(),
        bargainingBehaviour: bargaining.toLowerCase(),
        isProductAll: setForAll,
        ...(!setForAll && {
          startRange: Number(priceRange[0]),
          endRange: Number(priceRange[1]),
          noOfProducts: parseInt(noOfproducts, 10) || 0,
        })
      };

      const response = await fetch("http://localhost:5000/bargaining/set-by-category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to set bargaining details");
      }

      alert("Bargaining details set successfully!");
    } catch (error) {
      alert(error.message || "An error occurred");
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
            <Typography color="#344767" fontWeight="bold" sx={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '18px', mb: 2 }}>
              For Every Categories
            </Typography>
            <Typography variant="subtitle2">
              Set the minimum and maximum values for every category
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

        <Grid item xs={12} sm={6} md={4} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Select a product type
          </Typography>
          <FormControl fullWidth>
            <Select
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    minWidth: 120,
                  },
                },
              }}
            >
              <MenuItem value="">
                Select a Product type
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Set the min price of the product
            </Typography>
            <TextField
              type="number"
              fullWidth
              label="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Box display="flex" justifyContent="space-between" gap={6} mt={1} alignItems="center">
              {editing === "increase" ? (
                <TextField
                  type="number"
                  value={newPercentage}
                  onChange={(e) => setNewPercentage(e.target.value)}
                  onBlur={() => setEditing(null)}
                  autoFocus
                  sx={{ width: 60 }}
                />
              ) : (
                <Typography
                  sx={{ color: "green", fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => setEditing("increase")}
                >
                  {percentages.increase}
                </Typography>
              )}

              {editing === "decrease" ? (
                <TextField
                  type="number"
                  value={newPercentage}
                  onChange={(e) => setNewPercentage(e.target.value)}
                  onBlur={() => setEditing(null)}
                  autoFocus
                  sx={{ width: 60 }}
                />
              ) : (
                <Typography
                  sx={{ color: "red", fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => setEditing("decrease")}
                >
                  {percentages.decrease}
                </Typography>
              )}
            </Box>
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

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Select upto how many numbers of products
        </Typography>

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
            <Grid container alignItems="center" justifyContent="flex-center" spacing={2}>
              <Grid item>
                <Typography variant="body1">
                  Select products up to:
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  type="number"
                  size="small"
                  value={noOfproducts}
                  onChange={handleProductChange}
                  disabled={setForAll}
                  style={{ width: 120 }}
                  inputProps={{
                    step: 10,
                    min: 10,
                    max: 200,
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
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "2%" }}>
              <Slider
                value={localPriceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={minPriceBound}
                max={maxPriceBound}
                step={1}
                sx={{ width: "100%" }}
                disabled={setForAll}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  ${localPriceRange[0].toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  ${localPriceRange[1].toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                backgroundColor: "#000",
                padding: "6px 20px",
                color: "#fff",
                textTransform: "none",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CategorySettings;