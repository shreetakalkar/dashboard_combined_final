import mongoose from "mongoose";

const categoryVariantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    variants: [
      {
        variantId: { type: String, required: true },
        productId: { type: String, required: true },
        productTitle: { type: String },
        price: { type: String },
        sku: { type: String },
        inventory_quantity: { type: Number },
        requires_shipping: { type: Boolean },
        weight: { type: Number },
        weight_unit: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date },
      }
    ],
  },
  { timestamps: true }
);

export const CategoryVariant = mongoose.model(
  "CategoryVariant",
  categoryVariantSchema
);
