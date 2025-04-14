// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, CardContent, Typography, Grid, Button, LinearProgress, Box } from "@mui/material";

// const RequestedProducts = ({ scrollToBargainTable }) => {
//   const [bargainingProducts, setBargainingProducts] = useState([]);

//   useEffect(() => {
//     const fetchBargainRequests = async () => {
//       try {
//         const response = await axios.post("/api/v1/bargaining/get-bargain-request", {
//           shopName: "wandala3",
//         });

//         // Transform and aggregate duplicate products
//         const aggregatedData = response.data.data.reduce((acc, item) => {
//           const productName = item.productName;

//           // Calculate the percentage (Example logic: adjust as needed)
//           const percentage = Math.min(100, Math.floor((item.productPrice / 1000) * 100));

//           if (acc[productName]) {
//             acc[productName].percentage += percentage; // Sum percentages for duplicate products
//           } else {
//             acc[productName] = {
//               id: item._id,
//               name: productName,
//               percentage: percentage,
//             };
//           }

//           return acc;
//         }, {});

//         // Convert object back to array
//         setBargainingProducts(Object.values(aggregatedData));
//       } catch (error) {
//         console.error("Error fetching bargaining requests:", error);
//       }
//     };

//     fetchBargainRequests();
//   }, []);

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <Card sx={{ p: 0.8, minHeight: 120, boxShadow: 2 }}>
//           <CardContent sx={{ display: "flex", flexDirection: "column", gap: 0.6, p: 1 }}>
//             <Typography variant="subtitle1" sx={{ color: "#344767", fontWeight: 700, fontSize: "16px" }}>
//               Bargaining Requested Products
//             </Typography>

//             {bargainingProducts.length === 0 ? (
//               <Typography variant="body2" color="textSecondary">
//                 No products found.
//               </Typography>
//             ) : (
//               bargainingProducts.map((product, index) => (
//                 <div key={index} style={{ marginBottom: "4px" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                     <Typography variant="body2" style={{ color: "#7B809A", fontSize: "14px" }}>
//                       {product.name} - {product.id}
//                     </Typography>
//                     <Typography variant="caption" style={{ minWidth: "30px", textAlign: "right" }}>
//                       {Math.min(100, product.percentage)}%
//                     </Typography>
//                   </div>
//                   <LinearProgress variant="determinate" value={Math.min(100, product.percentage)} sx={{ height: 5, width: "100%" }} />
//                 </div>
//               ))
//             )}

//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.6, pt: 1 }}>
//               <Typography variant="caption" style={{ color: "#7B809A", fontSize: "12px" }}>
//                 More than <strong style={{ fontWeight: "700", fontSize: "14px" }}>1,500,000</strong> requests received for bargaining request by users.
//                 Enable Bargenix in more products.
//               </Typography>

//               <Button
//                 variant="contained"
//                 sx={{ fontSize: "0.7rem", py: 0.8, px: 2, minWidth: "180px", background: "linear-gradient(180deg, #3E3D45 0%, #202020 100%)" }}
//                 onClick={scrollToBargainTable}
//               >
//                 VIEW ALL REQUESTS
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default RequestedProducts;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Button, LinearProgress, Box } from "@mui/material";

const RequestedProducts = ({ scrollToBargainTable }) => {
  const [bargainingProducts, setBargainingProducts] = useState([]);
  const [shopName, setShopName] = useState(localStorage.getItem("shopifyShopName") || "");

  // Fetch bargain requests dynamically when shopName changes
  useEffect(() => {
    const fetchBargainRequests = async () => {
      if (!shopName.trim()) return; 

      try {
        const response = await axios.post("/api/v1/bargaining/get-bargain-request", { shopName });
        const aggregatedData = response.data.data.reduce((acc, item) => {
          const productName = item.productName;
          const percentage = Math.min(100, Math.floor((item.productPrice / 1000) * 100));

          if (acc[productName]) {
            acc[productName].percentage += percentage; 
          } else {
            acc[productName] = {
              id: item._id,
              name: productName,
              percentage: percentage,
            };
          }
          return acc;
        }, {});

        setBargainingProducts(Object.values(aggregatedData));
      } catch (error) {
        console.error("Error fetching bargaining requests:", error);
      }
    };

    fetchBargainRequests();
  }, [shopName]); 

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedShopName = localStorage.getItem("shopifyShopName") || "";
      setShopName(updatedShopName);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 0.8, minHeight: 120, boxShadow: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 0.6, p: 1 }}>
            <Typography variant="subtitle1" sx={{ color: "#344767", fontWeight: 700, fontSize: "16px" }}>
              Bargaining Requested Products
            </Typography>

            {bargainingProducts.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No products found.
              </Typography>
            ) : (
              bargainingProducts.map((product, index) => (
                <div key={index} style={{ marginBottom: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" style={{ color: "#7B809A", fontSize: "14px" }}>
                      {product.name} - {product.id}
                    </Typography>
                    <Typography variant="caption" style={{ minWidth: "30px", textAlign: "right" }}>
                      {Math.min(100, product.percentage)}%
                    </Typography>
                  </div>
                  <LinearProgress variant="determinate" value={Math.min(100, product.percentage)} sx={{ height: 5, width: "100%" }} />
                </div>
              ))
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.6, pt: 1 }}>
              <Typography variant="caption" style={{ color: "#7B809A", fontSize: "12px" }}>
                More than <strong style={{ fontWeight: "700", fontSize: "14px" }}>1,500,000</strong> requests received for bargaining request by users.
                Enable Bargenix in more products.
              </Typography>

              <Button
                variant="contained"
                sx={{ fontSize: "0.7rem", py: 0.8, px: 2, minWidth: "180px", background: "linear-gradient(180deg, #3E3D45 0%, #202020 100%)" }}
                onClick={scrollToBargainTable}
              >
                VIEW ALL REQUESTS
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RequestedProducts;


