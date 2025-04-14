import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  TablePagination,
  Card,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SetMinPriceModal from "../../SetMinPriceModel";

const BargainTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [bargainRequests, setBargainRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState(localStorage.getItem("shopifyShopName") || "");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bargain requests dynamically
  useEffect(() => {
    const fetchBargainRequests = async () => {
      if (!shopName.trim()) return;

      try {
        setLoading(true);
        const response = await axios.post("/api/v1/bargaining/get-bargain-request", {
          shopName: shopName,
        });

        if (Array.isArray(response.data.data)) {
          setBargainRequests(response.data.data);
        } else {
          setBargainRequests([]);
        }
      } catch (error) {
        console.error("Error fetching bargain requests:", error);
        setBargainRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBargainRequests();
  }, [shopName]);

  const fetchBargainRequests = async () => {
  try {
    const response = await axios.post("/api/v1/bargaining/get-bargain-request", {
      shopName: localStorage.getItem("shopifyShopName") || "",
    });

    if (Array.isArray(response.data.data)) {
      setBargainRequests(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching bargain requests:", error);
  }
};

  // Listen for shop name changes from ShopifySync
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedShopName = localStorage.getItem("shopifyShopName") || "";
      setShopName(updatedShopName);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredData = bargainRequests.filter((row) =>
    Object.values(row || {}).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Function to open modal
  const handleApproveClick = (row) => {
    setSelectedProduct({
      id: row._id,
      product: row.productName,
      defaultPrice: row.productPrice,
      category: row.category || "NAN", 
      status: row.status, 
    });
    setIsModalOpen(true);
  };

  // Function to save minimum price and update the status
  const handleSaveMinPrice = async (minPrice) => {
    if (!selectedProduct) return;

    try {
      const response = await axios.post("/api/v1/inventory/save-min-price", {
        productId: selectedProduct.id,
        minPrice,
      });

      if (response.data.success) {
        fetchBargainRequests();
      }
    } catch (error) {
      console.error("Error saving minimum price:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <div className="custom-loader"></div>
      </Box>
    );
  }

  return (
    <Card sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3, p: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight="bold" color="#344767" mb={1}>
          Bargain Requests
        </Typography>
        <Typography variant="body2" mb={2}>
          View and manage all bargain requests.
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              size="small"
              variant="outlined"
              sx={{ width: 80 }}
            >
              {[5, 10, 15, bargainRequests.length].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="body2">Entries per page</Typography>
          </Box>

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
            sx={{ maxWidth: 300 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Product Id</b></TableCell>
                <TableCell><b>Shop Name</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Created At</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>${row.productPrice}</TableCell>
                  <TableCell>{row.productId}</TableCell>
                  <TableCell>{row.shopName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color={row.status === "Approved" ? "success" : "warning"}
                    >
                      {row.status || "Pending"}
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {row.status !== "Approved" && (
                      <Button variant="contained" color="primary" size="small" onClick={() => handleApproveClick(row)}>
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15, bargainRequests.length]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
      {/* Modal for Setting Minimum Price */}
      <SetMinPriceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMinPrice}
        selectedProduct={selectedProduct}
        defaultPrice={selectedProduct?.defaultPrice || 0}
      />
    </Card>
  );
};

export default BargainTable;




// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Box,
//   TextField,
//   MenuItem,
//   InputAdornment,
//   TablePagination,
//   Card,
//   Button,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";

// // Mock data for testing
// const generateMockBargainRequests = () => {
//   return Array.from({ length: 15 }, (_, index) => ({
//     _id: `mock-${index}`,
//     productName: `Product ${index + 1}`,
//     productPrice: (Math.random() * 100 + 10).toFixed(2),
//     customerEmail: `customer${index + 1}@example.com`,
//     shopName: "Test Shop",
//     isRead: Math.random() > 0.5, // Randomly mark some as read
//     createdAt: new Date(Date.now() - index * 86400000).toISOString(), // Different timestamps
//   }));
// };

// const BargainTable = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [search, setSearch] = useState("");
//   const [bargainRequests, setBargainRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call delay
//     setTimeout(() => {
//       setBargainRequests(generateMockBargainRequests());
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const filteredData = bargainRequests.filter((row) =>
//     Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const markAsRead = (id) => {
//     setBargainRequests((prevRequests) =>
//       prevRequests.map((req) =>
//         req._id === id ? { ...req, isRead: true } : req
//       )
//     );
//   };

//   if (loading) {
//     return <Typography>Loading bargain requests...</Typography>;
//   }

//   return (
//     <Card sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3, p: 2 }}>
//       <Box>
//         <Typography variant="h6" fontWeight="bold" color="#344767" mb={1}>
//           Bargain Requests (Mock Data)
//         </Typography>
//         <Typography variant="body2" mb={2}>
//           View and manage all bargain requests.
//         </Typography>

//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Box display="flex" alignItems="center" gap={1}>
//             <TextField
//               select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setPage(0);
//               }}
//               size="small"
//               variant="outlined"
//               sx={{ width: 80 }}
//             >
//               {[5, 10, 15].map((num) => (
//                 <MenuItem key={num} value={num}>
//                   {num}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <Typography variant="body2">Entries per page</Typography>
//           </Box>

//           <TextField
//             placeholder="Search here"
//             variant="outlined"
//             size="small"
//             onChange={(e) => setSearch(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ maxWidth: 300 }}
//           />
//         </Box>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Product Name</b></TableCell>
//                 <TableCell><b>Price</b></TableCell>
//                 <TableCell><b>Customer Email</b></TableCell>
//                 <TableCell><b>Shop Name</b></TableCell>
//                 <TableCell><b>Status</b></TableCell>
//                 <TableCell><b>Created At</b></TableCell>
//                 <TableCell><b>Action</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedData.map((row) => (
//                 <TableRow key={row._id}>
//                   <TableCell>{row.productName}</TableCell>
//                   <TableCell>${row.productPrice}</TableCell>
//                   <TableCell>{row.customerEmail}</TableCell>
//                   <TableCell>{row.shopName}</TableCell>
//                   <TableCell>{row.isRead ? "Read" : "Unread"}</TableCell>
//                   <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
//                   <TableCell>
//                     {!row.isRead && (
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         onClick={() => markAsRead(row._id)}
//                       >
//                         Mark as Read
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 15]}
//           component="div"
//           count={filteredData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={(event, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(event) => {
//             setRowsPerPage(parseInt(event.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </Box>
//     </Card>
//   );
// };

// export default BargainTable;
