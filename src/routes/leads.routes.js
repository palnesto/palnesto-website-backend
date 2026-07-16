import { Router } from "express";
import {
  createLead,
  listLeads,
  listMeetingLeads,
  listPaidLeads,
} from "../controllers/leads.controller.js";

export const leadsRouter = Router();

leadsRouter.get("/", listLeads);
leadsRouter.get("/paid", listPaidLeads);
leadsRouter.get("/meetings", listMeetingLeads);
leadsRouter.post("/", createLead);
