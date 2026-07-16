import { Router } from "express";
import { listPlans, seedDefaultPlans } from "../controllers/plans.controller.js";

export const plansRouter = Router();

plansRouter.get("/", listPlans);
plansRouter.post("/seed-defaults", seedDefaultPlans);
