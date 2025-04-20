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
  FormControl, Select, MenuItem,
} from "@mui/material";

// const CategorySettings = () => {
//   const [bargaining, setBargaining] = useState("Normal");
//   const [priceRange, setPriceRange] = useState([200, 500]);
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState(200);
//   const [setForAll, setSetForAll] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [percentages, setPercentages] = useState({ increase: "+2.7%", decrease: "-2.7%" });
//   const [editing, setEditing] = useState(null);
//   const [newPercentage, setNewPercentage] = useState("");
//   const [noOfproducts, setNoOfProducts] = useState("");

//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`http://localhost:8000/api/v1/shopify/all-products?timestamp=${Date.now()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       const transformedProducts = data.data.products.map(product => ({
//         id: product.id,
//         name: product.name,
//         defaultPrice: parseFloat(product.price),
//         category: product.product_type
//       }));

//       setProducts(transformedProducts);
//       return transformedProducts;
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleEditClick = (type) => {
//     setEditing(type);
//     setNewPercentage(percentages[type].replace(/[-+%]/g, ""));
//   };

//   const handlePercentageChange = (e) => {
//     setNewPercentage(e.target.value);
//   };

//   const handlePercentageSave = (type) => {
//     if (!newPercentage) return;

//     const fixedValue = type === "increase" ? `+${newPercentage}%` : `-${newPercentage}%`;

//     setPercentages({ ...percentages, [type]: fixedValue });
//     setEditing(null);
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const token = localStorage.getItem("authToken");

//         if (!token) {
//           throw new Error("No authentication token found.");
//         }

//         const response = await fetch("http://localhost:8000/api/v1/shopify/all-products-category", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Fetched Data:", result);

//         const collections = result.data?.collections;
//         if (collections && typeof collections === "object") {
//           const categoriesArray = Object.entries(collections).flatMap(([key, items]) =>
//             items.map(item => ({
//               id: item.id,
//               title: item.name || key,
//               totalProducts: item.inventory_quantity ?? 0,
//               activeProducts: item.inventory_quantity > 0 ? item.inventory_quantity : 0,
//               icon: item.icon || "",
//             }))
//           );

//           setCategories(categoriesArray);
//         } else {
//           throw new Error("Invalid data format: 'collections' is not an object.");
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err.message);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (event) => {
//     if (!setForAll) {
//       setCategory(event.target.value);
//     }
//   };

//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//   };

//   const handleBargainingChange = (event, newBargaining) => {
//     if (newBargaining !== null) setBargaining(newBargaining);
//   };

//   const handleSwitchChange = (event) => {
//     setSetForAll(event.target.checked);
//   };


//   // const handleSave = async () => {
//   //   if (!selectedProduct) {
//   //     alert("Please select a product first");
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     const response = await fetch('http://localhost:8000/api/v1/bargaining/set-min-price', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${token}`
//   //       },
//   //       body: JSON.stringify({
//   //         productId: selectedProduct.id,
//   //         minPrice: minPrice
//   //       })
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Failed to set min price');
//   //     }

//   //     // Update local storage with new bargaining details
//   //     const currentBargainingDetails = JSON.parse(localStorage.getItem('bargainingDetails') || '{}');
//   //     const updatedBargainingDetails = {
//   //       ...currentBargainingDetails,
//   //       [selectedProduct.id]: {
//   //         minPrice: minPrice,
//   //         isActive: true
//   //       }
//   //     };

//   //     // Update locked min prices
//   //     const currentLockedMinPrices = JSON.parse(localStorage.getItem('lockedMinPrices') || '{}');
//   //     const updatedLockedMinPrices = {
//   //       ...currentLockedMinPrices,
//   //       [selectedProduct.id]: true
//   //     };

//   //     localStorage.setItem('bargainingDetails', JSON.stringify(updatedBargainingDetails));
//   //     localStorage.setItem('lockedMinPrices', JSON.stringify(updatedLockedMinPrices));

//   //     alert("Minimum price set successfully!");
//   //   } catch (error) {
//   //     console.error("Error saving min price:", error);
//   //     alert("Failed to save minimum price");
//   //   }
//   // };

// const handleSave = async () => {
//     try {
//         setLoading(true);
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//             alert("Authentication token missing");
//             return;
//         }

//         let discount;
//         switch (bargaining) {
//             case "Low":
//                 discount = 10;
//                 break;
//             case "Normal":
//                 discount = 20;
//                 break;
//             case "High":
//                 discount = 30;
//                 break;
//             default:
//                 discount = 20;
//         }

//         const payload = {
//             discount: discount.toString(),
//             productId: "50666661642471",
//             startRange: Number(priceRange[0]),
//             endRange: Number(priceRange[1]),
//             noOfProducts: noOfProducts,
//         };

//         console.log("Payload Sent to API:", JSON.stringify(payload));

//         // First API call: Set bargaining details by category
//         const response1 = await fetch("http://localhost:8000/api/v1/bargaining/set-by-category", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//         });

//         const result1 = await response1.json();
//         console.log("API Response (set-by-category):", result1);

//         if (!response1.ok) {
//             throw new Error(result1.message || "Failed to set bargaining details");
//         }

//         alert("Bargaining details set successfully!");

//         // Second API call: Set minimum price (using the same token)
//         const response2 = await fetch("http://localhost:8000/api/v1/bargaining/set-min-price", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload), // Assuming similar payload is required
//         });

//         const result2 = await response2.json();
//         console.log("API Response (set-min-price):", result2);

//         if (!response2.ok) {
//             throw new Error(result2.message || "Failed to set minimum price");
//         }

//         alert("Minimum price set successfully!");
//     } catch (error) {
//         console.error("Error:", error);
//         alert(error.message || "An error occurred");
//     } finally {
//         setLoading(false);
//     }
// };

const CategorySettings = () => {
  const [bargaining, setBargaining] = useState("Normal");
  const [priceRange, setPriceRange] = useState([200, 500]);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(200);
  const [setForAll, setSetForAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [percentages, setPercentages] = useState({ increase: "+2.7%", decrease: "-2.7%" });
  const [editing, setEditing] = useState(null);
  const [newPercentage, setNewPercentage] = useState("");
  const [noOfproducts, setNoOfProducts] = useState("");

  React.useEffect(() => {
    if (setForAll) {
      setNoOfProducts("");
    }
  }, [setForAll]);

  const [products, setProducts] = useState([]); // 🔥 FIX: Defined setProducts state

  // const fetchProducts = async () => {
  //     try {
  //         const token = localStorage.getItem("authToken");
  //         if (!token) {
  //             throw new Error("No authentication token found");
  //         }

  //         const response = await fetch(`http://localhost:8000/api/v1/shopify/all-products?timestamp=${Date.now()}`, {
  //             method: "GET",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 "Authorization": `Bearer ${token}`,
  //                 "Cache-Control": "no-cache, no-store, must-revalidate",
  //             },
  //         });

  //         if (!response.ok) {
  //             throw new Error(`HTTP error! Status: ${response.status}`);
  //         }

  //         const data = await response.json();
  //         const transformedProducts = data.data.products.map(product => ({
  //             id: product.id,
  //             name: product.name,
  //             defaultPrice: parseFloat(product.price),
  //             category: product.product_type,
  //         }));

  //         setProducts(transformedProducts);
  //         return transformedProducts;
  //     } catch (err) {
  //         console.error("Error fetching products:", err);
  //         throw err;
  //     }
  // };

  // useEffect(() => {
  //     fetchProducts();
  // }, []);

    const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:5000/shopify/all-products?timestamp=${Date.now()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
          // Removed Cache-Control header to avoid CORS issues
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const transformedProducts = data.data.products.map(product => ({
        id: product.id,
        name: product.name,
        defaultPrice: parseFloat(product.price),
        category: product.product_type
      }));

      setProducts(transformedProducts);
      return transformedProducts;
    } catch (err) {
      console.error("Error fetching products:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await fetch("http://localhost:5000/shopify/all-products-category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetched Data:", result);

        // Assuming result.data.collections is an object where keys are category names
        const collections = result.data?.collections;
        if (collections && typeof collections === 'object') {
          // Extract category names as an array of strings
          const categoryNames = Object.keys(collections).filter(key => key && typeof key === 'string');
          console.log('Available categories:', categoryNames);
          setCategories(categoryNames);
        } else {
          console.error('Invalid collections data:', collections);
          setCategories([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    // Validate that the selected category exists in the categories list
    if (selectedCategory && categories.includes(selectedCategory)) {
      setCategory(selectedCategory);
    } else if (selectedCategory === "") {
      // Allow clearing the selection
      setCategory("");
    } else {
      console.warn(`Category "${selectedCategory}" is not in the available categories list`);
      // Do not update the category state if invalid
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleBargainingChange = (event, newBargaining) => {
    if (newBargaining !== null) setBargaining(newBargaining);
  };

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setSetForAll(isChecked);

    // Provide feedback to the user
    if (isChecked) {
      alert("Settings will apply to all products within the selected category only.");
    }
  };


  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate category is selected and valid
      if (!category) {
        alert("Please select a category");
        setLoading(false);
        return;
      }

      if (categories.length > 0 && !categories.includes(category)) {
        alert(`The category "${category}" does not exist. Please select a valid category from the dropdown.`);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication token missing");
        setLoading(false);
        return;
      }

      let discount;
      switch (bargaining) {
        case "Low":
          discount = 10;
          break;
        case "Normal":
          discount = 20;
          break;
        case "High":
          discount = 30;
          break;
        default:
          discount = 20;
      }

      // Prepare payload with correct category string
      const selectedCategory = category || "Uncategorized";

      // Always apply to products within the selected category only
      let payload = {
        category: selectedCategory,
        minPrice: discount.toString(),
        bargainingBehaviour: bargaining.toLowerCase(),
        isProductAll: setForAll, // true means apply to all products in the selected category
      };

      if (!setForAll) {
        payload = {
          ...payload,
          startRange: Number(priceRange[0]),
          endRange: Number(priceRange[1]),
          noOfProducts: Number(noOfproducts) || 0,
        };
      }

      console.log("Payload Sent to API:", JSON.stringify(payload));

      const response1 = await fetch("http://localhost:5000/bargaining/set-by-category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result1 = await response1.json();
      console.log("API Response (set-by-category):", result1);

      if (!response1.ok) {
        throw new Error(result1.message || "Failed to set bargaining details");
      }

      alert("Bargaining details set successfully!");
    } catch (error) {
      console.error("Error:", error);

      if (error.message && error.message.includes("No products found")) {
        if (setForAll) {
          alert(`No products found in category: ${category || "Uncategorized"}. Please select a different category.`);
        } else {
          alert(`No products found in category: ${category || "Uncategorized"} within the given price range. Please adjust your price range or select a different category.`);
        }
      } else {
        alert(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card
        sx={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "transparent",
          boxShadow: "none",
          fontFamily: 'sans-serif'
        }}
      >
        {/* Header Section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography color="#344767" fontWeight="bold" sx={{ fontFamily: ' sans-serif', fontWeight: 'bold', fontSize: '18px', mb: 2 }}>
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

        {/* Category Dropdown */}
          <Grid item xs={12} sm={6} md={4} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Select a Category
          </Typography>
          <FormControl fullWidth >
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
                Select a Category
              </MenuItem>
              {/* Dynamically populated categories */}
              {loading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : error ? (
                <MenuItem disabled>{Error}</MenuItem>
              ) : (
                // categories.map((cat) => (
                //   <MenuItem key={cat.id} value={cat.title}>
                //     {cat.title}
                //   </MenuItem>
                // ))
                 categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {/* Min Price */}
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

          {/* Max Price */}
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
          {/* Switch and Label */}
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
                  onChange={(e) => setNoOfProducts(e.target.value)}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", width: "30%", marginLeft: "2%" }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={10}
                max={1000}
                step={10}
                sx={{ width: "100%" }}
                disabled={setForAll}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "#000",
                padding: "6px 20px",
                color: "#fff",
                textTransform: "none",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CategorySettings;



// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   Typography,
//   TextField,
//   Slider,
//   Switch,
//   FormControlLabel,
//   ToggleButton,
//   ToggleButtonGroup,
//   Button,
//   FormControl,
//   Select,
//   MenuItem,
//   RadioGroup,
//   Radio,
// } from "@mui/material";

// const CategorySettings = () => {
//   const [bargaining, setBargaining] = useState("Normal");
//   const [priceRange, setPriceRange] = useState([200, 500]);
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState(200);
//   const [minPriceType, setMinPriceType] = useState("fixed");
//   const [minPricePercentage, setMinPricePercentage] = useState(2);
//   const [setForAll, setSetForAll] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [percentage] = useState({ increase: "+2.7%", decrease: "-2.7%" });
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Fetch products from API
//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`http://localhost:8000/api/v1/shopify/all-products?timestamp=${Date.now()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//           "Pragma": "no-cache",
//           "Expires": "0"
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       const transformedProducts = data.data.products.map(product => ({
//         id: product.id,
//         name: product.name,
//         defaultPrice: parseFloat(product.price),
//         category: product.product_type
//       }));

//       setProducts(transformedProducts);
//       return transformedProducts;
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       throw err;
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await fetchProducts();
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleProductChange = (event) => {
//     const product = products.find(p => p.id === event.target.value);
//     setSelectedProduct(product);
//     if (product) {
//       // Reset price inputs when product changes
//       if (minPriceType === 'fixed') {
//         setMinPrice(product.defaultPrice * 0.98); // Default to 2% less than default price
//       } else {
//         setMinPricePercentage(2); // Default to 2%
//         setMinPrice(product.defaultPrice * 0.98);
//       }
//     }
//   };

//   const handleMinPriceTypeChange = (event) => {
//     setMinPriceType(event.target.value);
//     if (selectedProduct) {
//       if (event.target.value === 'fixed') {
//         // Convert percentage to fixed price
//         const calculatedPrice = selectedProduct.defaultPrice * (1 - minPricePercentage / 100);
//         setMinPrice(calculatedPrice);
//       } else {
//         // Convert fixed price to percentage
//         const percentage = ((selectedProduct.defaultPrice - minPrice) / selectedProduct.defaultPrice) * 100;
//         setMinPricePercentage(percentage);
//       }
//     }
//   };

//   const handleMinPriceInputChange = (event) => {
//     const value = parseFloat(event.target.value);
//     if (!selectedProduct) return;

//     if (minPriceType === 'fixed') {
//       if (value >= selectedProduct.defaultPrice) {
//         alert("Min price cannot be greater than or equal to default price");
//         return;
//       }
//       setMinPrice(value);
//     } else {
//       if (value >= 100) {
//         alert("Percentage discount cannot be 100% or greater");
//         return;
//       }
//       setMinPricePercentage(value);
//       const calculatedPrice = selectedProduct.defaultPrice * (1 - value / 100);
//       setMinPrice(calculatedPrice);
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center">
//       <Card sx={{
//         width: "100%",
//         maxWidth: "900px",
//         backgroundColor: "transparent",
//         boxShadow: "none",
//         fontFamily: 'sans-serif'
//       }}>
//         {/* Header Section */}
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={6}>
//             <Typography color="#344767" fontWeight="bold" sx={{ fontFamily: 'sans-serif', fontSize: '18px', mb: 2 }}>
//               Set Minimum Price
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* Product Selection */}
//         <Grid item xs={12} sm={6} md={4} sx={{ mb: 2 }}>
//           <Typography variant="body2" sx={{ mb: 1 }}>
//             Select a Product
//           </Typography>
//           <FormControl fullWidth>
//             <Select
//               value={selectedProduct?.id || ""}
//               onChange={handleProductChange}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select Product
//               </MenuItem>
//               {products.map((product) => (
//                 <MenuItem key={product.id} value={product.id}>
//                   {product.name} (${product.defaultPrice})
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>

//         {selectedProduct && (
//           <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
//             <Grid item xs={6} sm={4}>
//               <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                 Set the min price
//               </Typography>

//               <RadioGroup
//                 row
//                 value={minPriceType}
//                 onChange={handleMinPriceTypeChange}
//                 sx={{ mb: 2 }}
//               >
//                 <FormControlLabel value="fixed" control={<Radio />} label="Fixed Price" />
//                 <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
//               </RadioGroup>

//               <TextField
//                 type="number"
//                 fullWidth
//                 label={minPriceType === 'fixed' ? 'Min Price' : 'Percentage Discount'}
//                 value={minPriceType === 'fixed' ? minPrice : minPricePercentage}
//                 onChange={handleMinPriceInputChange}
//                 InputProps={{
//                   endAdornment: minPriceType === 'percentage' ? '%' : '$',
//                 }}
//               />

//               {minPriceType === 'percentage' && (
//                 <Typography variant="body2" sx={{ mt: 1 }}>
//                   Calculated Min Price: ${minPrice.toFixed(2)}
//                 </Typography>
//               )}

//               <Typography variant="body2" sx={{ mt: 1 }}>
//                 Default Price: ${selectedProduct.defaultPrice}
//               </Typography>
//             </Grid>
//           </Grid>
//         )}

//         {/* Save Button */}
//         <Box mt={3}>
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: "#000",
//               color: "#fff",
//               "&:hover": { backgroundColor: "#333" },
//             }}
//             disabled={!selectedProduct}
//           >
//             Save
//           </Button>
//         </Box>
//       </Card>
//     </Box>
//   );
// };

// export default CategorySettings;



// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   Typography,
//   TextField,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   Button,
//   FormControl,
//   Select,
//   MenuItem,
// } from "@mui/material";

// const CategorySettings = () => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [minPriceType, setMinPriceType] = useState("percentage");
//   const [minPricePercentage, setMinPricePercentage] = useState(20);
//   const [minPrice, setMinPrice] = useState(0);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch products from API
//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await fetch(`http://localhost:8000/api/v1/shopify/all-products?timestamp=${Date.now()}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Cache-Control": "no-cache, no-store, must-revalidate",
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       const transformedProducts = data.data.products.map(product => ({
//         id: product.id,
//         name: product.name,
//         defaultPrice: parseFloat(product.price),
//         category: product.product_type
//       }));

//       setProducts(transformedProducts);
//       return transformedProducts;
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleProductChange = (event) => {
//     const product = products.find(p => p.id === event.target.value);
//     setSelectedProduct(product);
//     if (product) {
//       updateCalculatedMinPrice(20, product.defaultPrice); // Default 20% discount
//     }
//   };

//   const updateCalculatedMinPrice = (percentage, defaultPrice) => {
//     const calculatedPrice = defaultPrice * (1 - percentage / 100);
//     setMinPrice(calculatedPrice);
//     setMinPricePercentage(percentage);
//   };

//   const handlePercentageChange = (event) => {
//     const value = parseFloat(event.target.value);
//     if (!selectedProduct || isNaN(value)) return;

//     if (value >= 100) {
//       alert("Percentage discount cannot be 100% or greater");
//       return;
//     }

//     updateCalculatedMinPrice(value, selectedProduct.defaultPrice);
//   };

//   const handleSave = async () => {
//     if (!selectedProduct) {
//       alert("Please select a product first");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch('http://localhost:8000/api/v1/bargaining/set-min-price', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           productId: selectedProduct.id,
//           minPrice: minPrice
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to set min price');
//       }

//       const result = await response.json();

//       // Update local storage with new bargaining details
//       const currentBargainingDetails = JSON.parse(localStorage.getItem('bargainingDetails') || '{}');
//       const updatedBargainingDetails = {
//         ...currentBargainingDetails,
//         [selectedProduct.id]: {
//           minPrice: minPrice,
//           isActive: true
//         }
//       };

//       // Update locked min prices
//       const currentLockedMinPrices = JSON.parse(localStorage.getItem('lockedMinPrices') || '{}');
//       const updatedLockedMinPrices = {
//         ...currentLockedMinPrices,
//         [selectedProduct.id]: true
//       };

//       localStorage.setItem('bargainingDetails', JSON.stringify(updatedBargainingDetails));
//       localStorage.setItem('lockedMinPrices', JSON.stringify(updatedLockedMinPrices));

//       alert("Minimum price set successfully!");
//     } catch (error) {
//       console.error("Error saving min price:", error);
//       alert("Failed to save minimum price");
//     }
//   };

//   return (
//     <Box display="flex" justifyContent="center">
//       <Card sx={{
//         width: "100%",
//         maxWidth: "900px",
//         backgroundColor: "transparent",
//         boxShadow: "none",
//         fontFamily: 'sans-serif'
//       }}>
//         <Typography color="#344767" fontWeight="bold" sx={{ fontSize: '18px', mb: 2 }}>
//           Set Minimum Price
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               Select a Product
//             </Typography>
//             <FormControl fullWidth>
//               <Select
//                 value={selectedProduct?.id || ""}
//                 onChange={handleProductChange}
//                 displayEmpty
//               >
//                 <MenuItem value="" disabled>
//                   Select Product
//                 </MenuItem>
//                 {products.map((product) => (
//                   <MenuItem key={product.id} value={product.id}>
//                     {product.name} (${product.defaultPrice})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {selectedProduct && (
//             <Grid item xs={12}>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 Set the min price
//               </Typography>

//               <RadioGroup
//                 row
//                 value={minPriceType}
//                 onChange={(e) => setMinPriceType(e.target.value)}
//                 sx={{ mb: 2 }}
//               >
//                 <FormControlLabel value="fixed" control={<Radio />} label="Fixed Price" />
//                 <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
//               </RadioGroup>

//               <TextField
//                 type="number"
//                 fullWidth
//                 label="Percentage Discount"
//                 value={minPricePercentage}
//                 onChange={handlePercentageChange}
//                 InputProps={{
//                   endAdornment: '%'
//                 }}
//                 sx={{ mb: 2 }}
//               />

//               <Typography variant="body2">
//                 Calculated Min Price: ${minPrice.toFixed(2)}
//               </Typography>

//               <Typography variant="body2" sx={{ mb: 2 }}>
//                 Default Price: ${selectedProduct.defaultPrice}
//               </Typography>

//               <Button
//                 variant="contained"
//                 onClick={handleSave}
//                 sx={{
//                   backgroundColor: "#000",
//                   color: "#fff",
//                   "&:hover": { backgroundColor: "#333" },
//                   textTransform: "uppercase"
//                 }}
//               >
//                 Save
//               </Button>
//             </Grid>
//           )}
//         </Grid>
//       </Card>
//     </Box>
//   );
// };

// export default CategorySettings;
