import mongoose from "mongoose";

const shopifyProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      default: "Uncategorized",
      index: true,
    },
    vendor: {
      type: String,
      default: "Unknown",
    },
    description: {
      type: String,
      default: "No description available",
    },
    variants: [
      {
        variantId: { type: String, required: true },
        title: String,
        price: String,
        sku: String,
        inventory_quantity: Number,
        requires_shipping: Boolean,
        weight: Number,
        weight_unit: String,
      }
    ],
    images: [String],
    tags: [String],
    created_at: Date,
    updated_at: Date,
  },
  { timestamps: true }
);

export const ShopifyProduct = mongoose.model(
  "ShopifyProduct",
  shopifyProductSchema
);
