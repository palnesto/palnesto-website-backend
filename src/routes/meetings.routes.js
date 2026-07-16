import { Router } from "express";
import {
  createBlockedSlot,
  listMeetingSlots,
  scheduleMeeting,
} from "../controllers/meetings.controller.js";

export const meetingsRouter = Router();

meetingsRouter.get("/slots", listMeetingSlots);
meetingsRouter.post("/blocks", createBlockedSlot);
meetingsRouter.post("/schedule", scheduleMeeting);
