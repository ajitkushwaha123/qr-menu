import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: "IN" },
  },
  { _id: false }
);

const ThemeSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: "#111827" },
    secondaryColor: { type: String, default: "#F97316" },
    darkMode: { type: Boolean, default: false },
  },
  { _id: false }
);

const RestaurantSchema = new mongoose.Schema(
  {
    ownerClerkUserId: {
      type: String,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    address: AddressSchema,

    plan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
      index: true,
    },
    planExpiresAt: {
      type: Date,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
    },

    subdomain: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    domainStatus: {
      type: String,
      enum: ["none", "pending", "verifying", "active", "error"],
      default: "none",
    },
    theme: ThemeSchema,
  },
  { timestamps: true }
);

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
