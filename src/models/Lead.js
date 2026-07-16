import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    planSlug: { type: String, required: true, trim: true },
    planName: { type: String, required: true, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    customizationSelections: { type: [String], default: [] },
    customizationAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    source: {
      type: String,
      enum: ["paid", "meet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "not_applicable"],
      default: "not_applicable",
    },
    paymentOrderId: { type: String, default: "" },
    meetStatus: {
      type: String,
      enum: ["not_requested", "requested", "scheduled", "blocked"],
      default: "not_requested",
    },
    meetLink: { type: String, default: "" },
    meetStartAt: { type: Date, default: null },
    meetEndAt: { type: Date, default: null },
    chatbotTranscript: { type: [mongoose.Schema.Types.Mixed], default: [] },
    managerNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Lead = mongoose.model("Lead", leadSchema);
