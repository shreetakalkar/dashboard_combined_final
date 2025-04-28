import mongoose from 'mongoose';

const loginTimestampSchema = new mongoose.Schema({
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    required: false
  }
});

const clientDetailsSchema = new mongoose.Schema(
  {
    shopifyStoreOwnerName: {
      type: String,
      required: true,
      trim: true
    },
    shopifyStoreName: {
      type: String,
      required: true,
      trim: true
    },
    loginTimestamps: [loginTimestampSchema],
    basicShopifyDetails: {
      accessToken: {
        type: String,
        required: true,
        trim: true
      },
      apiVersion: {
        type: String,
        required: true,
        trim: true
      }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plan: {
      type: String,
      enum: ['free', 'startup', 'business', 'enterprise'],
      default: 'free'
    }
  },
  {
    timestamps: true
  }
);

export const ClientDetails = mongoose.model('clientDetails', clientDetailsSchema);
