import mongoose from "mongoose";

const customizationOptionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const planSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    sampleVideoUrl: { type: String, default: "" },
    paymentEnabled: { type: Boolean, default: false },
    customizationOptions: { type: [customizationOptionSchema], default: [] },
  },
  { timestamps: true },
);

export const Plan = mongoose.model("Plan", planSchema);
