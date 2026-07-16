import { BlockedSlot } from "../models/BlockedSlot.js";
import { Lead } from "../models/Lead.js";

function buildDateRange(from, to) {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  if (!fromDate || Number.isNaN(fromDate.getTime())) {
    const error = new Error("A valid `from` date is required.");
    error.status = 400;
    throw error;
  }

  if (!toDate || Number.isNaN(toDate.getTime())) {
    const error = new Error("A valid `to` date is required.");
    error.status = 400;
    throw error;
  }

  if (fromDate >= toDate) {
    const error = new Error("`to` must be later than `from`.");
    error.status = 400;
    throw error;
  }

  return { fromDate, toDate };
}

async function ensureSlotAvailable(startAt, endAt) {
  const overlapQuery = {
    $or: [
      {
        startAt: { $lt: endAt },
        endAt: { $gt: startAt },
      },
    ],
  };

  const [blockedSlot, scheduledLead] = await Promise.all([
    BlockedSlot.findOne(overlapQuery).lean(),
    Lead.findOne({
      source: "meet",
      meetStatus: "scheduled",
      meetStartAt: { $lt: endAt },
      meetEndAt: { $gt: startAt },
    }).lean(),
  ]);

  if (blockedSlot || scheduledLead) {
    const error = new Error("This meeting slot is no longer available.");
    error.status = 409;
    throw error;
  }
}

export async function listMeetingSlots(req, res, next) {
  try {
    const { fromDate, toDate } = buildDateRange(req.query.from, req.query.to);

    const [blockedSlots, scheduledMeetings] = await Promise.all([
      BlockedSlot.find({
        startAt: { $lt: toDate },
        endAt: { $gt: fromDate },
      })
        .sort({ startAt: 1 })
        .lean(),
      Lead.find({
        source: "meet",
        meetStatus: "scheduled",
        meetStartAt: { $lt: toDate },
        meetEndAt: { $gt: fromDate },
      })
        .sort({ meetStartAt: 1 })
        .lean(),
    ]);

    res.json({
      blockedSlots,
      scheduledMeetings,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBlockedSlot(req, res, next) {
  try {
    const { startAt, endAt, reason } = req.body;
    const { fromDate, toDate } = buildDateRange(startAt, endAt);
    await ensureSlotAvailable(fromDate, toDate);

    const blockedSlot = await BlockedSlot.create({
      startAt: fromDate,
      endAt: toDate,
      reason: reason || "manager-blocked",
    });

    res.status(201).json({ blockedSlot });
  } catch (error) {
    next(error);
  }
}

export async function scheduleMeeting(req, res, next) {
  try {
    const payload = req.body;
    const { fromDate, toDate } = buildDateRange(
      payload.meetStartAt,
      payload.meetEndAt,
    );

    await ensureSlotAvailable(fromDate, toDate);

    const lead = await Lead.create({
      ...payload,
      source: "meet",
      meetStatus: "scheduled",
      meetStartAt: fromDate,
      meetEndAt: toDate,
      paymentStatus: payload.paymentStatus || "not_applicable",
    });

    res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
}
