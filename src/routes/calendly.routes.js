import { Router } from "express";
import { handleCalendlyWebhook } from "../controllers/calendly.controller.js";

export const calendlyRouter = Router();

calendlyRouter.post("/webhook/:webhookSecret", handleCalendlyWebhook);
