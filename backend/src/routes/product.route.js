// product.route.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getProductPriceRange } from "../controllers/product.controller.js";

const router = Router();

router.get("/price-range", verifyJWT, getProductPriceRange);

export default router;
