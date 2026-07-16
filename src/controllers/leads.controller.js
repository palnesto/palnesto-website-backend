import { Lead } from "../models/Lead.js";

export async function listLeads(req, res, next) {
  try {
    const source = req.query.source;
    const filter = source ? { source } : {};
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
}

export async function listPaidLeads(_req, res, next) {
  try {
    const leads = await Lead.find({ source: "paid" })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
}

export async function listMeetingLeads(_req, res, next) {
  try {
    const leads = await Lead.find({ source: "meet" })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
}

export async function createLead(req, res, next) {
  try {
    const payload = req.body;
    const lead = await Lead.create(payload);
    res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
}
