import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Grid
} from "@mui/material";

const SetMinPriceVariantsModal = ({ open, onClose, product, onSaveSuccess }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && product) {
      fetchVariants();
    }
  }, [open, product]);

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      // Fetch product variants from backend or Shopify API
      // Assuming backend has an endpoint to get variants by product id
      const response = await fetch(`http://localhost:5000/shopify/product-variants/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch variants");
      }

      const data = await response.json();
      // data expected to be array of variants with id, title, price, minPrice
      setVariants(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMinPriceChange = (variantId, value) => {
    setVariants(prev =>
      prev.map(v =>
        v.id === variantId ? { ...v, minPriceInput: value } : v
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      // Prepare updates array with variantId and minPrice
      const updates = variants.map(v => ({
        productId: v.id,
        minPrice: parseFloat(v.minPriceInput) || 0
      }));

      // Validate min prices
      for (const update of updates) {
        if (isNaN(update.minPrice) || update.minPrice <= 0) {
          throw new Error("All min prices must be positive numbers");
        }
      }

      const response = await fetch("http://localhost:5000/bargaining/set-bulk-min-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ updates })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save min prices");
      }

      alert("Minimum prices updated successfully!");
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Set Minimum Price for Variants - {product?.product}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box>
            {variants.length === 0 ? (
              <Typography>No variants found for this product.</Typography>
            ) : (
              <Grid container spacing={2}>
                {variants.map(variant => (
                  <Grid item xs={12} sm={6} key={variant.id}>
                    <Typography variant="subtitle2">{variant.title}</Typography>
                    <TextField
                      label="Min Price"
                      type="number"
                      fullWidth
                      value={variant.minPriceInput !== undefined ? variant.minPriceInput : variant.minPrice || ""}
                      onChange={e => handleMinPriceChange(variant.id, e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || loading}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetMinPriceVariantsModal;
