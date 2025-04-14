import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    setBargainingByCategory,
    setBargainingToAllProducts,
    setBargainingForSingleProduct,
    setBulkMinPrice,
    deleteBargaining,
    getBargainingDetails,
    deactivateAllProducts,
    deactivateByCategory,
    getBargainInfo,
    sendProductData,
    requestForBargain,
    getBargainRequestsByShop,
    markAsRead,
    toggleBargainingActive
} from "../controllers/bargaining.controller.js";

const router = Router();

// Bargaining Routes
router.route('/set-by-category')
    .post(verifyJWT, setBargainingByCategory);

router.route('/set-all-products')
    .post(verifyJWT, setBargainingToAllProducts);

router.route('/set-min-price')
    .post(verifyJWT, setBargainingForSingleProduct);

router.route('/set-min-price-bulk')
    .post(verifyJWT, setBulkMinPrice);

router.route('/delete/:productId')
    .delete(verifyJWT, deleteBargaining);

router.route('/details')
    .get(verifyJWT, getBargainingDetails);

router.route('/deactivate-all')
    .post(verifyJWT, deactivateAllProducts);

router.route('/deactivate-category')
    .post(verifyJWT, deactivateByCategory);

router.route('/bargain-info/:id')
    .get(verifyJWT, getBargainInfo);

router.route('/sendData')
    .post(verifyJWT, sendProductData);

router.route('/request-bargain')
    .post(verifyJWT, requestForBargain);

router.route('/get-bargain-request')
    .post(verifyJWT, getBargainRequestsByShop);

router.route('/request-read/:id')
    .put(verifyJWT, markAsRead);


router.route('/toggle-active/:productId')
.put(verifyJWT, toggleBargainingActive);
export default router;