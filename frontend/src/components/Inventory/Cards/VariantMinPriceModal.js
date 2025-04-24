import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";

const VariantMinPriceModal = ({
  open,
  onClose,
  onSave,
  defaultPrice,
  parentMinPrice,
  selectedVariant
}) => {
  const [minPrice, setMinPrice] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setMinPrice("");
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    const price = parseFloat(minPrice);
    
    if (isNaN(price)) {
      setError("Please enter a valid number");
      return;
    }

    if (price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (price >= defaultPrice) {
      setError(`Price must be less than variant price ($${defaultPrice.toFixed(2)})`);
      return;
    }

    if (parentMinPrice && price >= parentMinPrice) {
      setError(`Price must be less than parent product min price ($${parentMinPrice.toFixed(2)})`);
      return;
    }

    onSave(minPrice);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Minimum Price for Variant</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle1">
            Variant: {selectedVariant?.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Variant Price: ${defaultPrice?.toFixed(2)}
          </Typography>
          {parentMinPrice && (
            <Typography variant="body2" color="textSecondary">
              Parent Product Min Price: ${parentMinPrice?.toFixed(2)}
            </Typography>
          )}
        </Box>
        
        <TextField
          label="Minimum Price"
          type="number"
          fullWidth
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          error={!!error}
          helperText={error}
          inputProps={{
            min: 0,
            max: defaultPrice,
            step: "0.01"
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariantMinPriceModal;
