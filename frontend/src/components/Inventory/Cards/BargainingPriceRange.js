import React, { useState, useEffect } from "react";
import { Box, Grid, Card, Typography, TextField, Slider, Switch, FormControlLabel, ToggleButton, ToggleButtonGroup, Button } from "@mui/material";
import axios from "axios";

const BargainingPriceRange = () => {
    const [bargaining, setBargaining] = useState("Normal");
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [minPricePercentage, setMinPricePercentage] = useState(20);
    const [setForAll, setSetForAll] = useState(false);
    const [noOfProducts, setNoOfProducts] = useState("");
    const [loading, setLoading] = useState(false);
    const [minPriceLimit, setMinPriceLimit] = useState(0);
    const [maxPriceLimit, setMaxPriceLimit] = useState(1000);

    useEffect(() => {
        // Fetch min and max product prices from backend or API
        const fetchPriceRange = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.warn("No auth token found");
                    return;
                }
                const response = await axios.get("http://localhost:5000/products/price-range", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200 && response.data) {
                    const { minPrice, maxPrice } = response.data;
                    setMinPriceLimit(minPrice);
                    setMaxPriceLimit(maxPrice);
                    setPriceRange([minPrice, maxPrice]);
                }
            } catch (error) {
                console.error("Failed to fetch price range:", error);
            }
        };
        fetchPriceRange();
    }, []);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleBargainingChange = (event, newBargaining) => {
        if (newBargaining !== null) setBargaining(newBargaining);
    };

    const handleSwitchChange = (event) => {
        setSetForAll(event.target.checked);
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
                bargainingBehaviour: bargaining.toUpperCase()
            };

            console.log("Payload Sent to API:", JSON.stringify(payload));

            const response = await fetch("http://localhost:5000/bargaining/set-all-products", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("API Response:", result);

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
            <Card sx={{ width: "100%", maxWidth: "900px", backgroundColor: "transparent", boxShadow: "none", fontFamily: 'sans-serif' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography color="#344767" fontWeight="bold" sx={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '18px', mb: 2 }}>
                            For all the products
                        </Typography>
                        <Typography variant="subtitle2">Set the minimum and maximum values for all the products.</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="h6" fontWeight="bold" sx={{ mr: 4 }}>Bargaining behaviour</Typography>
                        <ToggleButtonGroup value={bargaining} exclusive onChange={handleBargainingChange} sx={{ mt: 2, gap: 2 }}>
                            <ToggleButton value="Low">Low</ToggleButton>
                            <ToggleButton value="Normal">Normal</ToggleButton>
                            <ToggleButton value="High">High</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={4}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Set the min price percentage (%)</Typography>
                        <TextField
                            type="number"
                            fullWidth
                            label="Min Price Percentage"
                            value={minPricePercentage}
                            onChange={handleMinPricePercentageChange}
                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={4} sx={{ mt: -4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Changing max price is unavailable right now</Typography>
                        <TextField label="Same as product price" disabled fullWidth sx={{ backgroundColor: "#D9D9D9" }} />
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
                                <Typography variant="body1">Select products up to:</Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={noOfProducts}
                                    onChange={handleProductChange}
                                    style={{ width: 120 }}
                                    disabled={setForAll}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box mt={1}>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>Select products priced between</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box sx={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "2%" }}>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                min={minPriceLimit}
                                max={maxPriceLimit}
                                step={1}
                                sx={{ width: "100%" }}
                            />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">${priceRange[0]}</Typography>
                                <Typography variant="body2">${priceRange[1]}</Typography>
                            </Box>
                        </Box>
                        <Button variant="contained" sx={{ backgroundColor: "#000", padding: "6px 20px", color: "#fff", textTransform: "none" }} onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default BargainingPriceRange;
