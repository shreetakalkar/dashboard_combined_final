import mongoose from "mongoose";

const shopifyCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collectionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["custom", "smart"],
      required: true,
    },
  },
  { timestamps: true }
);

export const ShopifyCollection = mongoose.model(
  "ShopifyCollection",
  shopifyCollectionSchema
);
