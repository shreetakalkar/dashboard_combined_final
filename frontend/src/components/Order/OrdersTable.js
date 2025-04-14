import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, InputAdornment, TablePagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowIcon from '../../assets/ar.png'
import Rectangle from '../../assets/rec.png'

const orders = [
  { id: "#10421", name: "Antonio Christ", product: "Nike Shirt", category: "Shirt", time: "8:00 am", rate: "+0.3", duration: "23s", price: "$23", status: "ongoing" },
  { id: "#10422", name: "Angelina Jouli", product: "Titan Watch", category: "Accessories", time: "8:00 pm", rate: "+0.7", duration: "27s", price: "$100", status: "halted" },
  { id: "#10423", name: "Darab Ahmed", product: "Adidas Shoes", category: "Footwear", time: "2:00 am", rate: "-0.4", duration: "24s", price: "$40", status: "completed" },
  { id: "#10424", name: "Leonardis", product: "Spoon set", category: "Kitchenware", time: "12:00 pm", rate: "+0.9", duration: "35s", price: "$50", status: "halted" },
  { id: "#10425", name: "Antonio Christ", product: "Nike Shirt", category: "Shirt", time: "12:15 am", rate: "-0.9", duration: "23s", price: "$23", status: "completed" },
  { id: "#10426", name: "Maria Susan", product: "Leather Bag", category: "Accessories", time: "10:00 am", rate: "+0.5", duration: "20s", price: "$70", status: "ongoing" },
  { id: "#10427", name: "David Warner", product: "Puma Cap", category: "Accessories", time: "1:00 pm", rate: "+0.2", duration: "19s", price: "$10", status: "completed" },
  { id: "#10428", name: "John Doe", product: "Kitchen Set", category: "Kitchenware", time: "4:00 pm", rate: "-0.3", duration: "30s", price: "$90", status: "halted" },
];

const summary = [
  { title: "Total Order", value: 281, change: "+55%", color: "green" },
  { title: "Ongoing Orders", value: 30, change: "-65%", color: "red" },
  { title: "Successful", value: 200, change: "+55%", color: "green" },
  { title: "Cancelled", value: 51, change: "+5%", color: "green" },
];

const OrdersTable = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage,] = useState(5);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (id) => {
    const cleanId = id.replace("#", ""); 
    console.log(`Navigating to /order/${cleanId}`); 
    navigate(`/order/${cleanId}`); 
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  // Handle Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filtering Orders based on Search
  const filteredOrders = orders.filter((order) =>
    Object.values(order)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sorting Orders
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (!a[orderBy] || !b[orderBy]) return 0; 
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const paginatedOrders = sortedOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        padding: '20px 42px',
        margin: 0,
        marginTop: '64px',
        marginLeft: '191px',
        backgroundColor: '#F5F6FA',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
        width: 'calc(101vw - 226px)',
        fontFamily: ' sans-serif'
      }}
    >
      <Box display="flex" justifyContent="space-between" gap={2} mb={4}>
        {summary.map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              width: "200px",
              height: "120px",
              padding: "6px"
            }}
          >
            <CardContent sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {item.value}
              </Typography>
              <Box
                sx={{
                  width: "calc(120% + 22px)", 
                  height: "1px",
                  backgroundColor: "#d3d3d3",
                  marginTop: "4px",
                  marginLeft: "-22px",
                  marginBottom: "8px"
                }}
              />
              <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "14px" }}>
                <Box component="span" sx={{ color: item.change.startsWith("+") ? "green" : "red" }}>
                  {item.change}
                </Box>{" "}
                <Box component="span" sx={{ color: "text.secondary", fontWeight: "normal" }}>
                  than last week
                </Box>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Card
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          marginTop: "16px",
        }}
      >
        <CardContent>
          <Typography component="span" color="#344767" mb={1} sx={{ fontFamily: ' sans-serif', fontWeight: 'bold', fontSize: '20px', }}>
            Orders Table
          </Typography>
          <Typography variant="body2" mb={2}>
            View all the orders
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                size="small"
                variant="outlined"
                sx={{ width: 80 }} 
              >
                {[5, 10, 15].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2">Entries per page</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <TextField
                placeholder="Search here"
                variant="outlined"
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 300, ml: 'auto' }} 
              />
            </Box>
          </Box>
           {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <div className="custom-loader"></div>
            </Box>
          ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              width: '110%', 
              marginX: '-60px', 
              padding: '0 24px', 
              overflowX: 'auto', 
            }}
          >
            <Table
              sx={{
                borderCollapse: 'collapse', 
                width: '100%', 
              }}
            >
              <TableHead sx={{ borderBottom: "2px solid #d3d3d3", }}>
                <TableRow
                  sx={{
                    '& > th': {
                      borderBottom: 'none', 
                    },
                  }}
                >
                  {[
                    "ID",
                    "Customer Name",
                    "Product",
                    "Categories",
                    "Start at",
                    "Rate",
                    "Time",
                    "Price",
                    "Status",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      onClick={() => handleSort(header.toLowerCase())}
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        border: 'none', 
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <span>{header}</span>
                        <img
                          src={ArrowIcon} 
                          alt="icon"
                          style={{
                            width: '10px', 
                            height: '20px',
                            marginRight: '4px',
                          }}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    style={{ cursor: "pointer" }}
                    hover
                  >
                    <TableCell style={{ display: 'flex', alignItems: 'center', border: 'none' }}>
                      <img
                        src={Rectangle}
                        alt="icon"
                        style={{ width: '26px', height: '26px', marginRight: '4px' }}
                      />
                      {order.id}
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.name}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.product}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.category}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.time}</TableCell>
                    <TableCell sx={{ color: order.rate > 0 ? "green" : order.rate < 0 ? "red" : "inherit", fontWeight: "bold", border: 'none' }}>
                      {order.rate}
                    </TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.duration}</TableCell>
                    <TableCell sx={{ border: 'none' }}>{order.price}</TableCell>
                    <TableCell sx={{
                      border: 'none', color: order.status === "completed" ? "green" :
                        order.status === "halted" ? "red" :
                          order.status === "ongoing" ? "orange" : "inherit",
                    }}>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
          {/* Pagination */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, orders.length)} of {orders.length} entries
            </Typography>
            <TablePagination
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[6]} 
              onRowsPerPageChange={() => { }} 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrdersTable;

