import { asyncHandler } from "../utils/asyncHandler.js";
import { ShopifyDetails } from "../models/shopifyDetails.model.js";
import axios from "axios";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Controller to get min and max product prices for the current user/store
export const getProductPriceRange = asyncHandler(async (req, res, next) => {
  const shopify = await ShopifyDetails.findOne({ userId: req.user._id });
  if (!shopify) {
    return next(new ApiError(404, "Shopify Access is not provided"));
  }

  const url = `https://${shopify.shopifyShopName}.myshopify.com/admin/api/${shopify.apiVersion}/products.json?fields=variants`;
  const { data } = await axios.get(url, {
    headers: {
      "X-Shopify-Access-Token": shopify.accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!data.products || data.products.length === 0) {
    return next(new ApiError(404, "No products found"));
  }

  let minPrice = Number.MAX_VALUE;
  let maxPrice = 0;

  for (const product of data.products) {
    for (const variant of product.variants) {
      const price = parseFloat(variant.price);
      if (!isNaN(price)) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    }
  }

  if (minPrice === Number.MAX_VALUE) minPrice = 0;

  res.status(200).json(
    new ApiResponse(200, { minPrice, maxPrice }, "Product price range fetched successfully")
  );
});
