import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,  Snackbar, Alert } from "@mui/material";

const SetMinPriceModal = ({ open, onClose, onSave, defaultPrice, selectedProduct }) => {
    const [minPrice, setMinPrice] = useState("");
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSave = () => {
        const numericPrice = parseFloat(minPrice);
        if (isNaN(numericPrice) || numericPrice >= defaultPrice) {
            setError("Minimum price must be less than the default price!");
            setOpenSnackbar(true);
            return;
        }
        onSave(numericPrice);
        onClose();
        setMinPrice(""); 
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Set Minimum Price
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", p: 3 }}>
                    {/* Product Details */}
                    <table style={{ width: "100%", marginBottom: "16px", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td><strong>ID:</strong></td>
                                <td>{selectedProduct?.id}</td>
                            </tr>
                            <tr>
                                <td><strong>Default Price:</strong></td>
                                <td>{selectedProduct?.defaultPrice}</td>
                            </tr>
                          
                            <tr>
                                <td><strong>Category:</strong></td>
                                <td>{selectedProduct?.category}</td>
                            </tr>
                            <tr>
                                <td><strong>Product:</strong></td>
                                <td>{selectedProduct?.product}</td>
                            </tr>
                            <tr>
                                <td><strong>Status:</strong></td>
                                <td>{selectedProduct?.status ? "Active" : "Inactive"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <TextField
                        fullWidth
                        label="Enter Min Price"
                        variant="outlined"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Min Price
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SetMinPriceModal;

