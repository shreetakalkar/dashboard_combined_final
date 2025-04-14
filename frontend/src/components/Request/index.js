import React, { useRef, useState, useEffect } from "react";
import { Box, Grid,  } from "@mui/material";

import RequestHeader from "./Cards/RequestHeader.js";
import RequestedProducts from "./Cards/RequestedProducts.js";
import BargainTable from "./Cards/RequestTable.js";

const Request = () => {
  const bargainTableRef = useRef(null); 
  const [loading, setLoading] = useState(true); 

  // Function to scroll down to BargainTable
  const scrollToBargainTable = () => {
    if (bargainTableRef.current) {
      bargainTableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer); 
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
        <div className="loader"></div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "20px 42px",
        margin: 0,
        marginTop: "64px",
        marginLeft: "191px",
        backgroundColor: "#F5F6FA",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        width: "calc(101vw - 226px)",
        fontFamily: "Roboto",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RequestHeader />
        </Grid>
        <Grid item xs={12} md={6}>
          <RequestedProducts scrollToBargainTable={scrollToBargainTable} />
        </Grid>
        <Grid item xs={12} ref={bargainTableRef}>
          <BargainTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Request;
