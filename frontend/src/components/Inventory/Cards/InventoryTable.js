import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  MenuItem,
  Pagination,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Select,
  CircularProgress
} from "@mui/material";
import { RefreshCw } from "lucide-react";
import SetMinPriceModal from "../../SetMinPriceModel";

const MAX_ACTIVE_PRODUCTS = 10;

const InventoryTable = () => {
  // State management
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bargainingDetails, setBargainingDetails] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [lockedMinPrices, setLockedMinPrices] = useState({});

  // Load saved state from localStorage
  useEffect(() => {
    const savedBargainingDetails = localStorage.getItem('bargainingDetails');
    const savedLockedMinPrices = localStorage.getItem('lockedMinPrices');

    if (savedBargainingDetails) {
      setBargainingDetails(JSON.parse(savedBargainingDetails));
    }
    if (savedLockedMinPrices) {
      setLockedMinPrices(JSON.parse(savedLockedMinPrices));
    }
  }, []);

  // API calls
  const fetchBargainingDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch('http://localhost:5000/bargaining/details', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bargaining details');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error fetching bargaining details:", error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch('http://localhost:5000/shopify/all-products', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const result = await response.json();
      return result.data?.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  // Data fetching and initialization
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, bargainingData] = await Promise.all([
          fetchProducts(),
          fetchBargainingDetails()
        ]);

        // Transform bargaining data into a map with isActive defaulting to false
        const bargainingMap = bargainingData.reduce((map, detail) => {
          map[detail.productId] = {
            minPrice: detail.minPrice,
            behavior: detail.behavior || "Normal",
            isActive: detail.isActive || false // Default to false if not specified
          };
          return map;
        }, {});

        // Transform products data
        const transformedProducts = productsData.map(product => {
          const variant = product.variants?.[0] || {};
          return {
            id: product.id,
            variantId: variant.id?.toString(),
            product: product.title,
            category: product.product_type || "Uncategorized",
            price: `$${variant.price || 0}`,
            defaultPrice: parseFloat(variant.price || 0),
            quantity: variant.inventory_quantity || 0,
            behavior: bargainingMap[product.id]?.behavior || "Normal",
            minPrice: bargainingMap[product.id]?.minPrice || ""
          };
        });

        setProducts(transformedProducts);
        setBargainingDetails(bargainingMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  // Handlers
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSaveMinPrice = async (minPrice) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required. Please login again.");
  
      // Convert and validate the input
      const numericPrice = parseFloat(minPrice);
      if (isNaN(numericPrice)) {
        throw new Error("Please enter a valid number");
      }
  
      if (numericPrice <= 0) {
        throw new Error("Price must be greater than 0");
      }
  
      if (numericPrice >= selectedProduct.defaultPrice) {
        throw new Error(`Minimum price must be less than $${selectedProduct.defaultPrice.toFixed(2)}`);
      }
  
      // Send direct min price to backend (no discount calculation)
      const response = await fetch('http://localhost:5000/bargaining/set-min-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProduct.variantId,
          minPrice: numericPrice 
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set minimum price');
      }
  
      // Update local state
      const updatedBargainingDetails = {
        ...bargainingDetails,
        [selectedProduct.variantId]: {
          ...(bargainingDetails[selectedProduct.variantId] || {}),
          minPrice: numericPrice.toFixed(2), // Store formatted price
          isActive: true,
          behavior: bargainingDetails[selectedProduct.variantId]?.behavior || "Normal"
        }
      };
  
      // Persist changes
      setBargainingDetails(updatedBargainingDetails);
      localStorage.setItem('bargainingDetails', JSON.stringify(updatedBargainingDetails));
      setRefreshKey(prev => prev + 1); // Trigger data refresh
      setIsModalOpen(false);
  
      alert(`Minimum price set to $${numericPrice.toFixed(2)} successfully!`);
    } catch (error) {
      console.error("Error setting minimum price:", error);
      alert(error.message || "Failed to set minimum price");
    }
  };

  const handleSetMinPrice = (product) => {
    if (product.quantity <= 0) {
      alert("Cannot set minimum price for out-of-stock products");
      return;
    }

    if (lockedMinPrices[product.id]) {
      alert("Minimum price is locked. Please delete it first to set a new price.");
      return;
    }

    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteMinPrice = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`http://localhost:5000/bargaining/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete min price');
      }

      // Update state - set isActive to false when deleting min price
      const updatedBargainingDetails = { ...bargainingDetails };
      if (updatedBargainingDetails[productId]) {
        updatedBargainingDetails[productId] = {
          ...updatedBargainingDetails[productId],
          isActive: false,
          minPrice: ""
        };
      }

      const updatedLockedMinPrices = { ...lockedMinPrices };
      delete updatedLockedMinPrices[productId];

      setBargainingDetails(updatedBargainingDetails);
      setLockedMinPrices(updatedLockedMinPrices);

      // Persist to localStorage
      localStorage.setItem('bargainingDetails', JSON.stringify(updatedBargainingDetails));
      localStorage.setItem('lockedMinPrices', JSON.stringify(updatedLockedMinPrices));

      // Refresh data
      setRefreshKey(prev => prev + 1);
      alert("Minimum price deleted successfully and product deactivated!");
    } catch (error) {
      console.error("Error deleting min price:", error);
      alert(error.message || "Failed to delete minimum price");
    }
  };

  const handleToggleActive = async (productId) => {
    // Only allow toggling if there's a min price set
    if (!bargainingDetails[productId]?.minPrice) {
      alert("Please set a minimum price before activating the product");
      return;
    }

    try {
      const currentActiveCount = Object.values(bargainingDetails).filter(
        detail => detail.isActive
      ).length;

      const isCurrentlyActive = bargainingDetails[productId]?.isActive || false;

      if (!isCurrentlyActive && currentActiveCount >= MAX_ACTIVE_PRODUCTS) {
        throw new Error(`Maximum ${MAX_ACTIVE_PRODUCTS} products can be active at a time`);
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`http://localhost:5000/bargaining/toggle-active/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !isCurrentlyActive
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle active status');
      }

      // Update state
      const updatedBargainingDetails = {
        ...bargainingDetails,
        [productId]: {
          ...bargainingDetails[productId],
          isActive: !isCurrentlyActive
        }
      };

      setBargainingDetails(updatedBargainingDetails);
      localStorage.setItem('bargainingDetails', JSON.stringify(updatedBargainingDetails));

      // Refresh data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert(error.message || "Failed to toggle active status");
    }
  };

  // Data processing
  const filteredProducts = products.filter(product =>
    Object.values(product).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filteredProducts.slice(startIndex, startIndex + entriesPerPage);

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Main render
  return (
    <Paper className="p-4">
      {/* Header */}
      <Grid container alignItems="center" sx={{ pt: 2, px: 3 }}>
        <Grid item xs>
          <Typography variant="h6" sx={{ fontFamily: 'sans-serif', fontWeight: "bold", color: "#344767" }}>
            Inventory Individual Product
          </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </IconButton>
        </Grid>
      </Grid>

      {/* Controls */}
      <Box sx={{ margin: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              size="small"
              variant="outlined"
              sx={{ width: 80 }}
            >
              {[5, 10, 15, 20, 25].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Typography variant="body2">Entries per page</Typography>
          </Grid>
          <Grid item xs />
          <Grid item>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: '0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Default Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Behavior</TableCell>
              <TableCell>Min Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={bargainingDetails[product.variantId]?.isActive ? "success" : "error"}
                    size="small"
                    onClick={() => handleToggleActive(product.variantId)}
                    disabled={product.quantity <= 0 || !bargainingDetails[product.variantId]?.minPrice}
                  >
                    {bargainingDetails[product.variantId]?.isActive ? "Active" : "Inactive"}
                  </Button>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.product}</TableCell>
                <TableCell>
                  <Select
                    value={product.behavior}
                    size="small"
                    variant="outlined"
                    sx={{ width: 120 }}
                    disabled
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {bargainingDetails[product.variantId]?.minPrice ? (
                    <Typography>
                      ${bargainingDetails[product.variantId].minPrice}
                    </Typography>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSetMinPrice(product)}
                      disabled={product.quantity <= 0 || lockedMinPrices[product.id]}
                    >
                      Set min price
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMinPrice(product.variantId)}
                      disabled={!bargainingDetails[product.variantId]?.minPrice}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Grid container justifyContent="space-between" alignItems="center" p={4}>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </Typography>
        </Grid>
        <Grid item>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
          />
        </Grid>
      </Grid>

      {/* Min Price Modal */}
      <SetMinPriceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMinPrice}
        defaultPrice={selectedProduct?.defaultPrice}
        selectedProduct={selectedProduct}
      />
    </Paper>
  );
};

export default InventoryTable;