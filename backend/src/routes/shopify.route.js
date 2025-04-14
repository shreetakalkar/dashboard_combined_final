import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getAllProducts,
    getAllProductsByCategory,
    getTotalOrders,
    setShopifyCred,
    updateShopifyCred,
} from "../controllers/shopify.controller.js";

const router = Router();

// Route to get all orders
router.route('/all-orders')
    .get(verifyJWT, getTotalOrders);

// Route to get all products
router.route('/all-products')
    .get(verifyJWT, getAllProducts);

// Route to get products by category
router.route('/all-products-category')
    .get(verifyJWT, getAllProductsByCategory);

// Route to set Shopify credentials
router.route('/set-shopify-cred')
    .post(verifyJWT, setShopifyCred);

// Route to update Shopify credentials
router.route('/update-shopify-cred')
    .put(verifyJWT, updateShopifyCred);

export default router;