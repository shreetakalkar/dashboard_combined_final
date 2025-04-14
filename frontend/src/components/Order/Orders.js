import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OrdersTable from "./OrdersTable";
import OrderDetails from "./OrderDetails";
import {Box } from "@mui/material";

const Orders = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulating a loading delay

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
         <div className="loader"  style={{ marginLeft: '8rem' }}></div>
      </Box>
    );
  }

  return (
    <Routes>
      <Route index element={<OrdersTable />} /> 
      <Route path=":orderId" element={<OrderDetails />} /> 
    </Routes>
  );
};

export default Orders;
