import React, { useState } from "react";
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

const InventoryTable = ({ products, bargainingDetails, onToggleActive, onDeleteMinPriceSuccess, onSetMinPriceSuccess, onRefresh }) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lockedMinPrices, setLockedMinPrices] = useState({});

  // Handlers
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleSaveMinPrice = async (minPrice) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required. Please login again.");

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

      alert(`Minimum price set to $${numericPrice.toFixed(2)} successfully!`);
      setIsModalOpen(false);
      // Instead of refreshing the page, notify parent component to update state
      if (onSetMinPriceSuccess) {
        onSetMinPriceSuccess(selectedProduct.variantId, numericPrice);
      }

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

      alert("Minimum price deleted successfully and product deactivated!");
      // Update lockedMinPrices state to unlock the min price button for this product
      setLockedMinPrices(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      // Notify parent component to update bargainingDetails and products state
      if (onDeleteMinPriceSuccess) {
        onDeleteMinPriceSuccess(productId);
      }

    } catch (error) {
      console.error("Error deleting min price:", error);
      alert(error.message || "Failed to delete minimum price");
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
  if (!products) {
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
          <IconButton onClick={handleRefresh} color="primary" disabled={!products || !onRefresh}>
            <RefreshCw className={!products ? "animate-spin" : ""} ></RefreshCw>
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
                    onClick={() => onToggleActive(product.variantId)}
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
                  {bargainingDetails[product.variantId]?.minPrice && parseFloat(bargainingDetails[product.variantId].minPrice) > 0 ? (
                    <Typography>
                      ${bargainingDetails[product.variantId].minPrice}
                    </Typography>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSetMinPrice(product)}
                      disabled={product.quantity <= 0 || lockedMinPrices[product.variantId]}
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
