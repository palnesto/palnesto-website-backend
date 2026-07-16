import { Router } from "express";
import { getManagerOverview } from "../controllers/manager.controller.js";

export const managerRouter = Router();

managerRouter.get("/overview", getManagerOverview);
