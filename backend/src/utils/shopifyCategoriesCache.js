import { ShopifyDetails } from "../models/shopifyDetails.model.js";
import axios from "axios";

let categoriesCache = new Map(); // userId -> categories array

export async function fetchAndCacheCategories(userId) {
  if (categoriesCache.has(userId)) {
    return categoriesCache.get(userId);
  }

  const shopify = await ShopifyDetails.findOne({ userId });
  if (!shopify) {
    throw new Error("Shopify Access is not provided");
  }

  // Fetch custom collections
  const customCollectionsUrl = `https://${shopify.shopifyShopName}.myshopify.com/admin/api/${shopify.apiVersion}/custom_collections.json`;
  const smartCollectionsUrl = `https://${shopify.shopifyShopName}.myshopify.com/admin/api/${shopify.apiVersion}/smart_collections.json`;

  const [customCollectionsResponse, smartCollectionsResponse] = await Promise.all([
    axios.get(customCollectionsUrl, {
      headers: {
        "X-Shopify-Access-Token": shopify.accessToken,
        "Content-Type": "application/json",
      },
    }),
    axios.get(smartCollectionsUrl, {
      headers: {
        "X-Shopify-Access-Token": shopify.accessToken,
        "Content-Type": "application/json",
      },
    }),
  ]);

  const customCollections = customCollectionsResponse.data.custom_collections || [];
  const smartCollections = smartCollectionsResponse.data.smart_collections || [];

  // Combine collections
  const allCollections = [...customCollections, ...smartCollections];

  // Map collections to simplified category objects
  const categories = allCollections.map((collection) => ({
    id: collection.id.toString(),
    name: collection.title,
    handle: collection.handle,
  }));

  categoriesCache.set(userId, categories);
  return categories;
}

export function getCachedCategories(userId) {
  return categoriesCache.get(userId) || [];
}

export function clearCacheForUser(userId) {
  categoriesCache.delete(userId);
}
