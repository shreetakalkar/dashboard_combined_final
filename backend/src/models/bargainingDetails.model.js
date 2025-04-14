import mongoose from 'mongoose';
import { BARGAIN_BEHAVIOUR } from '../constants.js';

const bargainingDetailsSchema = new mongoose.Schema(
  {
    productId: { 
      type: String, 
      required: true 
    },
    minPrice: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized" // Default category if none is provided
    },
    isActive: {
      type: Boolean,
      default: false // Start all products as inactive
    },
    bargainBehaviour: {
      type: String,
      enum: BARGAIN_BEHAVIOUR, 
      required: true,
      default: "normal" // Default bargaining behavior
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    productTitle: {
      type: String,
      trim: true
    },
    variantTitle: {
      type: String,
      trim: true
    },
    originalPrice: {
      type: Number,
      required: false,
      min: 0 // Optional field for storing the original price
    },
    minPricePercentage: {
      type: Number,
      required: false,
      min: 0, // Optional field for storing the percentage used to calculate minPrice
    },
    deactivationReason: {
      type: String,
      trim: true,
      default: null // Optional field for storing the reason for deactivation
    }
  },
  { timestamps: true }
);

export const BargainingDetails = mongoose.model('BargainingDetails', bargainingDetailsSchema);