import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Account = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      console.log("Token Expiration Time:", decodedToken.exp);
      console.log("Current Time:", currentTime);

      if (decodedToken.exp < currentTime) {
        console.error("Token has expired. Redirecting to login.");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("http://localhost:5000/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "An error occurred. Please try again.");
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "Roboto",
        color: "#344767",
      }}
    >
      <Typography
        color="344767"
        sx={{ mb: 3, fontFamily: "sans-serif", fontSize: "18px", fontWeight: "bold" }}
      >
        Account Settings
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontFamily: "sans-serif", fontSize: "16px", fontWeight: "bold" }}
      >
        Change Password
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Current Password Field */}
      <TextField
        fullWidth
        label="Current password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        sx={{ mb: 2 }}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* New Password Field */}
      <TextField
        fullWidth
        label="New password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        sx={{ mb: 2 }}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password Field */}
      <TextField
        fullWidth
        label="Confirm New password"
        type={showConfirmPassword ? "text" : "password"}
        variant="outlined"
        sx={{ mb: 2 }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Forgot Password Link */}
      <Typography
        variant="body2"
        sx={{
          textAlign: "right",
          color: "primary.main",
          mb: 3,
          cursor: "pointer",
        }}
      >
        Forgot the password?
      </Typography>

      {/* Password Requirements */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        Password requirements
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Please follow this guide for a strong password:
      </Typography>
      <ul style={{ margin: "0 0 24px 16px", padding: 0 }}>
        <li>One special character</li>
        <li>Min 6 characters</li>
        <li>One number (2 are recommended)</li>
        <li>Change it often</li>
      </ul>

      {/* Update Password Button */}
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", borderRadius: "20px", px: 4 }}
          onClick={handlePasswordChange}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default Account;
