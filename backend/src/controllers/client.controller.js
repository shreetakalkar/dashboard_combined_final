import { ClientDetails } from "../models/clientDetails.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create client details with default free plan on user signup
export const createClientDetails = asyncHandler(async (user, shopifyData) => {
  const existingClient = await ClientDetails.findOne({ userId: user._id });
  if (existingClient) {
    return existingClient;
  }

  const clientDetails = await ClientDetails.create({
    shopifyStoreOwnerName: user.firstName + " " + user.lastName,
    shopifyStoreName: shopifyData.shopifyShopName || "",
    loginTimestamps: [],
    basicShopifyDetails: {
      accessToken: shopifyData.accessToken || "",
      apiVersion: shopifyData.apiVersion || "",
    },
    userId: user._id,
    plan: "free", // default free plan
  });

  return clientDetails;
});

// Upgrade client plan
export const upgradeClientPlan = asyncHandler(async (req, res, next) => {
  const { userId, newPlan } = req.body;

  if (!userId || !newPlan) {
    return next(new ApiError(400, "userId and newPlan are required"));
  }

  const validPlans = ["free", "startup", "business", "enterprise"];
  if (!validPlans.includes(newPlan)) {
    return next(new ApiError(400, "Invalid plan"));
  }

  const client = await ClientDetails.findOne({ userId });
  if (!client) {
    return next(new ApiError(404, "Client not found"));
  }

  client.plan = newPlan;
  await client.save();

  res.status(200).json({ message: `Plan upgraded to ${newPlan}`, client });
});
