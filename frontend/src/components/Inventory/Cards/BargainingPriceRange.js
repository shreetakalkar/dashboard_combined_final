// import React, { useState } from "react";
// import {
//     Box,
//     Grid,
//     Card,
//     Typography,
//     TextField,
//     Slider,
//     Switch,
//     FormControlLabel,
//     ToggleButton,
//     ToggleButtonGroup,
//     Button,
// } from "@mui/material";
// import axios from "axios";

// const BargainingPriceRange = () => {
//     const [bargaining, setBargaining] = useState("Normal");
//     const [priceRange, setPriceRange] = useState([200, 500]);
//     const [minPrice, setMinPrice] = useState(200);
//     const [setForAll, setSetForAll] = useState(true);
//     const [noOfProducts, setNoOfProducts] = useState(100);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handlePriceChange = (event, newValue) => {
//         setPriceRange(newValue);
//     };

//     const handleBargainingChange = (event, newBargaining) => {
//         if (newBargaining !== null) setBargaining(newBargaining);
//     };

//     const handleSwitchChange = () => {
//         setSetForAll(!setForAll);
//     };

//     const handleSave = async () => {
//         setLoading(true);
//         setMessage("");

//         const payload = {
//             discount: "30",
//             productId: "50666661642471",
//             startRange: priceRange[0].toString(),
//             endRange: priceRange[1].toString(),
//             noOfProducts: noOfProducts.toString()
//         };

//         try {
//             const response = await axios.post(
//                 "http://localhost:8000/api/v1/bargaining/set-all-products",
//                 payload
//             );
//             setMessage(response.data.message);
//         } catch (error) {
//             setMessage("Failed to save bargaining details.");
//         }

//         setLoading(false);
//     };

//     return (
//         <Box display="flex" justifyContent="center">
//             <Card sx={{ width: "100%", maxWidth: "900px", backgroundColor: "transparent", boxShadow: "none" }}>
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={6}>
//                         <Typography color="#344767" fontWeight="bold" sx={{ fontSize: '18px', mb: 2 }}>
//                             For all the products
//                         </Typography>
//                         <Typography variant="subtitle2">
//                             Set the minimum and maximum values for all the products.
//                         </Typography>
//                     </Grid>
//                     <Grid item xs={6} textAlign="right">
//                         <Typography variant="h6" fontWeight="bold" sx={{ mr: 4 }}>
//                             Bargaining behaviour
//                         </Typography>
//                         <ToggleButtonGroup value={bargaining} exclusive onChange={handleBargainingChange} sx={{ mt: 2 }}>
//                             <ToggleButton value="Low">Low</ToggleButton>
//                             <ToggleButton value="Normal">Normal</ToggleButton>
//                             <ToggleButton value="High">High</ToggleButton>
//                         </ToggleButtonGroup>
//                     </Grid>
//                 </Grid>
//                 <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                     <Grid item xs={6} sm={4}>
//                         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                             Set the min price of the product
//                         </Typography>
//                         <TextField type="number" fullWidth label="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
//                     </Grid>
//                     <Grid item xs={6} sm={4}>
//                         <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                             Max price is determined by the product
//                         </Typography>
//                         <TextField label="Same as product price" disabled fullWidth />
//                     </Grid>
//                 </Grid>
//                 <Grid container spacing={2} alignItems="center">
//                     <Grid item xs={6}>
//                         <FormControlLabel control={<Switch checked={setForAll} onChange={handleSwitchChange} />} label="Set for all products" />
//                     </Grid>
//                     <Grid item xs={6}>
//                         <Grid container alignItems="center" spacing={2}>
//                             <Grid item>
//                                 <Typography variant="body1">Select products up to:</Typography>
//                             </Grid>
//                             <Grid item>
//                                 <TextField type="number" size="small" value={noOfProducts} onChange={(e) => setNoOfProducts(e.target.value)} style={{ width: 120 }} />
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//                 <Box mt={1}>
//                     <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
//                         Select products priced between
//                     </Typography>
//                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                         <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
//                             <Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={100} max={1000} />
//                             <Box display="flex" justifyContent="space-between">
//                                 <Typography variant="body2">${priceRange[0]}</Typography>
//                                 <Typography variant="body2">${priceRange[1]}</Typography>
//                             </Box>
//                         </Box>
//                         <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}>
//                             {loading ? "Saving..." : "Save"}
//                         </Button>
//                     </Box>
//                     {message && <Typography mt={2} color="green">{message}</Typography>}
//                 </Box>
//             </Card>
//         </Box>
//     );
// };

// export default BargainingPriceRange;

import React, { useState } from "react";
import { Box, Grid, Card, Typography, TextField, Slider, Switch, FormControlLabel, ToggleButton, ToggleButtonGroup, Button,
} from "@mui/material";

const BargainingPriceRange = () => {
    const [bargaining, setBargaining] = useState("Normal");
    const [priceRange, setPriceRange] = useState([200, 500]);
    const [minPrice, setMinPrice] = useState(200);
    const [setForAll, setSetForAll] = useState(false);
    const [percentages, setPercentages] = useState({ increase: "+2.7%", decrease: "-2.7%" });
    const [editing, setEditing] = useState(null);
    const [newPercentage, setNewPercentage] = useState("");
    const [noOfProducts, setNoOfProducts] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEditClick = (type) => {
        setEditing(type);
        setNewPercentage(percentages[type].replace(/[-+%]/g, ""));
    };

    const handlePercentageChange = (e) => {
        setNewPercentage(e.target.value);
    };

    const handlePercentageSave = (type) => {
        if (!newPercentage) return;

        const fixedValue = type === "increase" ? `+${newPercentage}%` : `-${newPercentage}%`;

        setPercentages({ ...percentages, [type]: fixedValue });
        setEditing(null);
    };

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


// const fetchBargainingDetails = async () => {
//     try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//             throw new Error("No authentication token found");
//         }

//         const response = await fetch(`http://localhost:8000/api/v1/bargaining/details`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             const errorMessage = await response.text();
//             throw new Error(`Error ${response.status}: ${errorMessage}`);
//         }

//         return await response.json();
//     } catch (err) {
//         console.error("Error fetching bargaining details:", err);
//         throw err;
//     }
// };


    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Authentication token is missing!");
                setLoading(false);
                return;
            }

            let discount;
            switch (bargaining) {
                case "Low": discount = 10; break;
                case "Normal": discount = 20; break;
                case "High": discount = 30; break;
                default: discount = 20;
            }

            const payload = {
                minPricePercentage: discount.toString(),
                productId: "50666661642471",
                startRange: Number(priceRange[0]),
                endRange: Number(priceRange[1]),
                noOfProducts: noOfProducts,
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

           // await fetchData();

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // const handleSave = async () => {
    //     setLoading(true);
    //     try {
    //         const token = localStorage.getItem("authToken");
    //         if (!token) {
    //             alert("Authentication token is missing!");
    //             setLoading(false);
    //             return;
    //         }

    //         let discount;
    //         switch (bargaining) {
    //             case "Low": discount = 10; break;
    //             case "Normal": discount = 20; break;
    //             case "High": discount = 30; break;
    //             default: discount = 20;
    //         }

    //         const payload = {
    //             discount: discount.toString(),
    //             productId: "50666661642471",
    //             startRange: Number(priceRange[0]),
    //             endRange: Number(priceRange[1]),
    //             noOfProducts: noOfProducts,
    //         };

    //         console.log("Payload Sent to API:", JSON.stringify(payload));

    //         const response = await fetch("http://localhost:8000/api/v1/bargaining/set-all-products", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         const result = await response.json();
    //         console.log("API Response:", result);

    //         if (!response.ok) {
    //             throw new Error(result.message || "Failed to set bargaining details");
    //         }

    //         alert("Bargaining details set successfully!");

    //         // Fetch updated data after saving
    //         fetchBargainingDetails();

    //     } catch (error) {
    //         console.error("Error:", error);
    //         alert(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Set the min price of the product</Typography>
                        <TextField type="number" fullWidth label="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        <Box display="flex" justifyContent="space-between" gap={6} mt={1} alignItems="center">
                            {editing === "increase" ? (
                                <TextField
                                    type="number"
                                    value={newPercentage}
                                    onChange={handlePercentageChange}
                                    onBlur={() => handlePercentageSave("increase")}
                                    autoFocus
                                    sx={{ width: 60 }}
                                />
                            ) : (
                                <Typography
                                    sx={{ color: "green", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={() => handleEditClick("increase")}
                                >
                                    {percentages.increase}
                                </Typography>
                            )}

                            {editing === "decrease" ? (
                                <TextField
                                    type="number"
                                    value={newPercentage}
                                    onChange={handlePercentageChange}
                                    onBlur={() => handlePercentageSave("decrease")}
                                    autoFocus
                                    sx={{ width: 60 }}
                                />
                            ) : (
                                <Typography
                                    sx={{ color: "red", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={() => handleEditClick("decrease")}
                                >
                                    {percentages.decrease}
                                </Typography>
                            )}
                        </Box>
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
                                min={10}
                                max={1000}
                                step={10}
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
