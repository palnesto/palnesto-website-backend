import { Lead } from "../models/Lead.js";

export async function getManagerOverview(_req, res, next) {
  try {
    const [paidLeads, meetingLeads] = await Promise.all([
      Lead.find({ source: "paid" }).sort({ createdAt: -1 }).lean(),
      Lead.find({ source: "meet" }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      paidLeads,
      meetingLeads,
    });
  } catch (error) {
    next(error);
  }
}
