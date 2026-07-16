import mongoose from "mongoose";

const blockedSlotSchema = new mongoose.Schema(
  {
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    reason: { type: String, default: "manager-blocked" },
  },
  { timestamps: true },
);

blockedSlotSchema.index({ startAt: 1, endAt: 1 });

export const BlockedSlot = mongoose.model("BlockedSlot", blockedSlotSchema);
