import { env } from "../config/env.js";
import { Lead } from "../models/Lead.js";

function getWebhookEventName(body) {
  if (typeof body?.event === "string") return body.event;
  if (typeof body?.event_type === "string") return body.event_type;
  return "";
}

function getCalendlyPayload(body) {
  if (body?.payload && typeof body.payload === "object") {
    return body.payload;
  }

  return body ?? {};
}

function getTrackingFromPayload(payload) {
  if (payload?.tracking && typeof payload.tracking === "object") {
    return payload.tracking;
  }

  if (
    payload?.scheduled_event?.tracking &&
    typeof payload.scheduled_event.tracking === "object"
  ) {
    return payload.scheduled_event.tracking;
  }

  return {};
}

function getSchedulingPatch(eventName, payload) {
  const scheduledEvent = payload?.scheduled_event ?? {};
  const location = scheduledEvent?.location ?? {};

  const patch = {
    calendlyEventUri:
      typeof scheduledEvent?.uri === "string" ? scheduledEvent.uri : "",
    calendlyInviteeUri: typeof payload?.uri === "string" ? payload.uri : "",
  };

  if (typeof scheduledEvent?.start_time === "string") {
    patch.meetStartAt = new Date(scheduledEvent.start_time);
  }

  if (typeof scheduledEvent?.end_time === "string") {
    patch.meetEndAt = new Date(scheduledEvent.end_time);
  }

  if (typeof location?.join_url === "string" && location.join_url.trim()) {
    patch.meetLink = location.join_url.trim();
  } else if (typeof scheduledEvent?.uri === "string" && scheduledEvent.uri.trim()) {
    patch.meetLink = scheduledEvent.uri.trim();
  }

  if (eventName === "invitee.created") {
    patch.meetStatus = "scheduled";
    return patch;
  }

  if (eventName === "invitee.canceled") {
    patch.meetStatus = payload?.rescheduled === true ? "requested" : "canceled";
    return patch;
  }

  return null;
}

export async function handleCalendlyWebhook(req, res, next) {
  try {
    const { webhookSecret } = req.params;

    if (!env.calendlyWebhookSecret || webhookSecret !== env.calendlyWebhookSecret) {
      res.status(401).json({ message: "Invalid Calendly webhook secret." });
      return;
    }

    const eventName = getWebhookEventName(req.body);
    const payload = getCalendlyPayload(req.body);
    const tracking = getTrackingFromPayload(payload);
    const leadId =
      typeof tracking?.utm_content === "string" ? tracking.utm_content.trim() : "";

    if (!leadId) {
      res.status(202).json({
        ignored: true,
        reason: "No lead tracking token was found on this Calendly event.",
      });
      return;
    }

    const patch = getSchedulingPatch(eventName, payload);

    if (!patch) {
      res.status(202).json({
        ignored: true,
        reason: `Calendly event ${eventName || "unknown"} is not handled.`,
      });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(leadId, patch, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      res.status(404).json({ message: "Matching lead not found." });
      return;
    }

    res.json({ lead });
  } catch (error) {
    next(error);
  }
}
