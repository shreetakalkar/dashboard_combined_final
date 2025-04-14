import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {  Box, Typography, Card, CardContent, Button, TextField, Avatar, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

const mockOrders = [
  { id: "#10421", name: "Antonio Christ", product: "Nike Shirt", category: "Shirt", time: "8:00 am", rate: "+0.3", duration: "23s", price: "$23", status: "ongoing" },
  { id: "#10422", name: "Angelina Jouli", product: "Titan Watch", category: "Accessories", time: "8:00 pm", rate: "+0.7", duration: "27s", price: "$100", status: "halted" },
  { id: "#10423", name: "Darab Ahmed", product: "Adidas Shoes", category: "Footwear", time: "2:00 am", rate: "-0.4", duration: "24s", price: "$40", status: "completed" },
  { id: "#10424", name: "Leonardis", product: "Spoon set", category: "Kitchenware", time: "12:00 pm", rate: "+0.9", duration: "35s", price: "$50", status: "halted" },
  { id: "#10425", name: "Antonio Christ", product: "Nike Shirt", category: "Shirt", time: "12:15 am", rate: "-0.9", duration: "23s", price: "$23", status: "completed" },
  { id: "#10426", name: "Maria Susan", product: "Leather Bag", category: "Accessories", time: "10:00 am", rate: "+0.5", duration: "20s", price: "$70", status: "ongoing" },
  { id: "#10427", name: "David Warner", product: "Puma Cap", category: "Accessories", time: "1:00 pm", rate: "+0.2", duration: "19s", price: "$10", status: "completed" },
  { id: "#10428", name: "John Doe", product: "Kitchen Set", category: "Kitchenware", time: "4:00 pm", rate: "-0.3", duration: "30s", price: "$90", status: "halted" },
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, this is NeyX, your bargaining assistant!" },
    { sender: "bot", text: "How are you doing today?" },
    { sender: "bot", text: "I see you are trying to bargain on PARA TROOPER Men's Leather Combat Boots, with the price of 947.00₹. How many are you planning to purchase today?" },
  ]);

  useEffect(() => {
    setTimeout(() => {
      const foundOrder = mockOrders.find((o) => o.id.replace("#", "") === orderId);
      setOrder(foundOrder);
      setLoading(false);
    }, 1500); 
  }, [orderId]);

  const handleResponse = (text) => {
    setMessages([...messages, { sender: "user", text }]);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
         <div className="custom-loader"></div>
      </Box>
    );
  }

  if (!order) {
    return <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>Order Not Found</Typography>;
  }

  return (
    <Box sx={{ 
          padding: "20px 42px",
          margin: 0,
          marginTop: "64px",
          marginLeft: "191px",
          backgroundColor: "#F5F6FA",
          minHeight: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
          width: "calc(101vw - 226px)",
          fontFamily: "sans-serif",
    }}>
      <Card sx={{ 
      boxShadow: 3,
      borderRadius: 2,
      p: 3,
      display: "flex",
      flexDirection: "column", 
      alignItems: "flex-start",
      gap: 3,
      backgroundColor: "white",
       }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start", gap: 1 }}>
          <CheckCircleOutlineIcon color="success" fontSize="large" />
          <Typography variant="h6" fontWeight="bold">Order Confirmed</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center", mt: 3 }}>
          <Box sx={{ flex: 1, p: 3,   width: 350, height: 500,}}>
            <Typography>Order ID: {order.id}</Typography>
            <Typography>Customer Name: {order.name}</Typography>
            <Typography>Product: {order.product}</Typography>
            <Typography>Category: {order.category}</Typography>
            <Typography>Time: {order.time}</Typography>
            <Typography>Rate: {order.rate}</Typography>
            <Typography>Duration: {order.duration}</Typography>
            <Typography>Price: {order.price}</Typography>
            <Typography>Status: {order.status}</Typography>
          </Box>
          
          <Card sx={{ width: 350, height: 600, borderRadius: 3, boxShadow: 3, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box sx={{ bgcolor: "primary.main", color: "white", p: 2 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> Amazon Bargaining Assistant
              </Typography>
              <Typography variant="body2">How about a little bargain before you buy?</Typography>
            </Box>

            <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: msg.sender === "bot" ? "flex-start" : "flex-end", mb: 1 }}>
                  {msg.sender === "bot" && <Avatar sx={{ bgcolor: "gray", mr: 1 }}>B</Avatar>}
                  <Typography sx={{
                    p: 1, px: 2, borderRadius: 2, maxWidth: "70%",
                    bgcolor: msg.sender === "bot" ? "#f1f1f1" : "#2196f3",
                    color: msg.sender === "bot" ? "black" : "white"
                  }}>
                    {msg.text}
                  </Typography>
                </Box>
              ))}
            </CardContent>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 2 }}>
              <Button variant="outlined" sx={{ borderRadius: 5, width: "90%" }} onClick={() => handleResponse("Planning to buy 3")}>Planning to buy 3</Button>
              <Button variant="outlined" sx={{ borderRadius: 5, width: "90%" }} onClick={() => handleResponse("Only 1")}>Only 1</Button>
              <Button variant="outlined" sx={{ borderRadius: 5, width: "90%" }} onClick={() => handleResponse("Not sure right now")}>Not sure right now</Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#f9f9f9" }}>
              <TextField fullWidth placeholder="Type your message" variant="outlined" sx={{ bgcolor: "white", borderRadius: 3 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    handleResponse(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <IconButton color="primary" sx={{ ml: 1 }}>
                <SendIcon />
              </IconButton>
            </Box>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};

export default OrderDetails;
