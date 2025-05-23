import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@mui/material';

import ProductCategories from '../Inventory/Cards/ProductCategories';
import BargainingPriceRange from '../Inventory/Cards/BargainingPriceRange';
import CategorySettings from '../Inventory/Cards/CategorySettings';
import PullOutReason from '../Inventory/Cards/PullOutReason';
import InventoryTable from '../Inventory/Cards/InventoryTable';

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ products: [], categories: [], metrics: [] });
  const [error, setError] = useState('');
  const [bargainingDetails, setBargainingDetails] = useState({});
  const [globalPriceRange, _setGlobalPriceRange] = useState([0, 1000]);
  const setGlobalPriceRange = (newRange) => {
    console.log("Global price range updated:", newRange);
    _setGlobalPriceRange(newRange);
  };
  const [categoryPriceRanges, setCategoryPriceRanges] = useState({});
  const [category, setCategory] = useState("");
  const [minPricePerCategory, setMinPricePerCategory] = useState({});

  // New state for current plan and product limit
  const [currentPlan, setCurrentPlan] = useState(null);
  const [productLimit, setProductLimit] = useState(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all products
        const response = await fetch('http://localhost:5000/shopify/all-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch inventory data');
        }

        const inventoryData = await response.json();
        const allProducts = inventoryData?.data?.products || [];
        const categories = inventoryData?.data?.availableCategories || [];

        // Calculate product counts per category
        const categoryCounts = allProducts.reduce((acc, product) => {
          const category = product.product_type || "Uncategorized";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Create categories array with counts
        const categoriesWithCounts = [{ name: "All Products", totalProducts: allProducts.length, activeProducts: 0 }, ...categories.map(category => ({
          name: category,
          totalProducts: categoryCounts[category] || 0,
          activeProducts: 0
        }))];

        // Fetch bargaining details for products
        const token = localStorage.getItem("authToken");
        const bargainingResponse = await fetch('http://localhost:5000/bargaining/details', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store"
        });

        if (!bargainingResponse.ok) {
          const errorData = await bargainingResponse.json();
          throw new Error(errorData.message || 'Failed to fetch bargaining details');
        }

        const bargainingData = await bargainingResponse.json();
        const bargainingMap = (bargainingData.data || []).reduce((map, detail) => {
          map[detail.productId] = {
            minPrice: detail.minPrice,
            behavior: detail.behavior || "Normal",
            isActive: detail.isActive || false
          };
          return map;
        }, {});

        // Transform products to include bargaining info
        let transformedProducts = [];
        allProducts.forEach(product => {
          (product.variants || []).forEach(variant => {
            const price = parseFloat(variant.price || 0);
            transformedProducts.push({
              id: product.id,
              variantId: variant.id?.toString(),
              product: product.title,
              variantName: variant.title || "",
              sku: variant.sku || "",
              category: product.product_type || "Uncategorized",
              price: price,
              defaultPrice: price,
              inventory_quantity: variant.inventory_quantity || 0,
              behavior: bargainingMap[variant.id]?.behavior || "Normal",
              minPrice: bargainingMap[variant.id]?.minPrice || "",
              isActive: bargainingMap[variant.id]?.isActive || false
            });
          });
        });

        // Calculate global price range
        const prices = transformedProducts.map(p => p.defaultPrice);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setGlobalPriceRange([minPrice, maxPrice]);

        // Calculate price ranges per category
        const rangesByCategory = {};
        transformedProducts.forEach(product => {
          const cat = product.category;
          if (!rangesByCategory[cat]) {
            rangesByCategory[cat] = {
              min: product.defaultPrice,
              max: product.defaultPrice
            };
          } else {
            if (product.defaultPrice < rangesByCategory[cat].min) {
              rangesByCategory[cat].min = product.defaultPrice;
            }
            if (product.defaultPrice > rangesByCategory[cat].max) {
              rangesByCategory[cat].max = product.defaultPrice;
            }
          }
        });
        setCategoryPriceRanges(rangesByCategory);

        // Calculate min price per category
        const minPricesByCategory = {};
        transformedProducts.forEach(product => {
          const cat = product.category;
          const productMinPrice = parseFloat(product.minPrice) || 0;
          if (!minPricesByCategory[cat] || productMinPrice < minPricesByCategory[cat]) {
            minPricesByCategory[cat] = productMinPrice;
          }
        });
        setMinPricePerCategory(minPricesByCategory);

        // Sort products by product title alphabetically, then by variantId ascending
        transformedProducts = transformedProducts.sort((a, b) => {
          if (a.product.toLowerCase() < b.product.toLowerCase()) return -1;
          if (a.product.toLowerCase() > b.product.toLowerCase()) return 1;
          if (a.variantId < b.variantId) return -1;
          if (a.variantId > b.variantId) return 1;
          return 0;
        });

        const activeProductCount = transformedProducts.filter(product => product.isActive).length;
        const inactiveProductCount = transformedProducts.length - activeProductCount;

        const metrics = [
          transformedProducts.length,
          activeProductCount,
          inactiveProductCount
        ];

        setData({ products: transformedProducts, categories: categoriesWithCounts, metrics });
        setBargainingDetails(bargainingMap);

      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError(err.message || 'Failed to fetch inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Fetch current plan and product limit on mount
  useEffect(() => {
    async function fetchPlan() {
      try {
        const shopDomain = new URL(window.location.origin).hostname;
        const res = await fetch(`/plan/plan-status?shop=${shopDomain}`);
        if (!res.ok) throw new Error('Failed to fetch plan status');
        const data = await res.json();
        setCurrentPlan(data.plan);
        setProductLimit(data.product_limit);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPlan();
  }, []);

  const handleToggleActive = async (productId) => {
    if (!bargainingDetails[productId]?.minPrice) {
      alert("Please set a minimum price before activating the product");
      return;
    }

    try {
      const currentActiveCount = Object.values(bargainingDetails).filter(
        detail => detail.isActive
      ).length;

      const isCurrentlyActive = bargainingDetails[productId]?.isActive || false;
      const MAX_ACTIVE_PRODUCTS = productLimit || 10; // Use productLimit from plan or default 10

      if (!isCurrentlyActive && currentActiveCount >= MAX_ACTIVE_PRODUCTS) {
        throw new Error(`Maximum ${MAX_ACTIVE_PRODUCTS} products can be active at a time`);
      }

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`http://localhost:5000/bargaining/toggle-active/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isActive: !isCurrentlyActive
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle active status');
      }

      // Update local state
      const updatedBargainingDetails = {
        ...bargainingDetails,
        [productId]: {
          ...bargainingDetails[productId],
          isActive: !isCurrentlyActive
        }
      };

      // Update products array with new isActive status
      let updatedProducts = data.products.map(product => {
        if (product.variantId === productId) {
          return { ...product, isActive: !isCurrentlyActive };
        }
        return product;
      });

      // Sort updated products by id ascending for consistent order
      updatedProducts = updatedProducts.sort((a, b) => a.id - b.id);

      const activeProductCount = updatedProducts.filter(product => product.isActive).length;
      const inactiveProductCount = updatedProducts.length - activeProductCount;

      const updatedMetrics = [
        updatedProducts.length,
        activeProductCount,
        inactiveProductCount
      ];

      setBargainingDetails(updatedBargainingDetails);
      setData(prevData => ({
        ...prevData,
        products: updatedProducts,
        metrics: updatedMetrics
      }));

    } catch (error) {
      console.error("Error toggling active status:", error);
      alert(error.message || "Failed to toggle active status");
    }
  };

  const handleDeleteMinPriceSuccess = (productId) => {
    // Update bargainingDetails to remove minPrice and set isActive to false
    const updatedBargainingDetails = {
      ...bargainingDetails,
      [productId]: {
        ...bargainingDetails[productId],
        minPrice: "",
        isActive: false
      }
    };

    // Update products array accordingly
    let updatedProducts = data.products.map(product => {
      if (product.variantId === productId) {
        return { ...product, minPrice: "", isActive: false };
      }
      return product;
    });

    // Sort updated products by id ascending for consistent order
    updatedProducts = updatedProducts.sort((a, b) => a.id - b.id);

    const activeProductCount = updatedProducts.filter(product => product.isActive).length;
    const inactiveProductCount = updatedProducts.length - activeProductCount;

    const updatedMetrics = [
      updatedProducts.length,
      activeProductCount,
      inactiveProductCount
    ];

    setBargainingDetails(updatedBargainingDetails);
    setData(prevData => ({
      ...prevData,
      products: updatedProducts,
      metrics: updatedMetrics
    }));
  };

  const handleSetMinPriceSuccess = (productId, minPrice) => {
    // Update bargainingDetails with new minPrice and set isActive to true
    const updatedBargainingDetails = {
      ...bargainingDetails,
      [productId]: {
        ...bargainingDetails[productId],
        minPrice: minPrice,
        isActive: true
      }
    };

    // Update products array accordingly
    let updatedProducts = data.products.map(product => {
      if (product.variantId === productId) {
        return { ...product, minPrice: minPrice };
      }
      return product;
    });

    // Sort updated products by id ascending for consistent order
    updatedProducts = updatedProducts.sort((a, b) => a.id - b.id);

    const activeProductCount = updatedProducts.filter(product => product.isActive).length;
    const inactiveProductCount = updatedProducts.length - activeProductCount;

    const updatedMetrics = [
      updatedProducts.length,
      activeProductCount,
      inactiveProductCount
    ];

    setBargainingDetails(updatedBargainingDetails);
    setData(prevData => ({
      ...prevData,
      products: updatedProducts,
      metrics: updatedMetrics
    }));
  };

  return (
    <Box sx={{
      padding: '20px 42px',
      marginTop: '64px',
      marginLeft: '191px',
      backgroundColor: '#F5F6FA',
      minHeight: '100vh',
      boxSizing: 'border-box',
      width: 'calc(100vw - 226px)',
      fontFamily: 'sans-serif',
    }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" align="center" sx={{ marginTop: '20px', color: 'red' }}>
          {error}
        </Typography>
      ) : data.products.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ marginTop: '20px', color: 'gray' }}>
          No inventory data available.
        </Typography>
      ) : (
        <>
          {/* Metric Cards */}
          <Grid container spacing={2} sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>
            {['Total Products', 'Active Products', 'Inactive Products', 'Total Available Products'].map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': {
                    backgroundColor: '#000',
                    '& .hover-text': { color: '#fff' },
                  },
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" className="hover-text" sx={{ transition: 'color 0.3s' }}>
                      {metric}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <Typography variant="h6" fontWeight="bold" className="hover-text" sx={{ transition: 'color 0.3s' }}>
                        {metric === 'Total Available Products' ? data.products.length : data.metrics[index] || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Sections */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <ProductCategories categories={data.categories} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <BargainingPriceRange data={data.products} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <CategorySettings 
                    priceRange={globalPriceRange}
                    setPriceRange={setGlobalPriceRange}
                    category={category}
                    setCategory={setCategory}
                    data={data.categories}
                    minPriceBound={globalPriceRange[0]}
                    maxPriceBound={globalPriceRange[1]}
                    categoryPriceRanges={categoryPriceRanges}
                    minPricePerCategory={minPricePerCategory}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <PullOutReason data={data.products} />
            </Grid>

            <Grid item xs={12}>
              <InventoryTable
                products={data.products}
                bargainingDetails={bargainingDetails}
                onToggleActive={handleToggleActive}
                onDeleteMinPriceSuccess={handleDeleteMinPriceSuccess}
                onSetMinPriceSuccess={handleSetMinPriceSuccess}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Inventory;