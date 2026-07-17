import cors from "cors";
import express from "express";
import morgan from "morgan";
import { healthRouter } from "./routes/health.routes.js";
import { calendlyRouter } from "./routes/calendly.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { managerRouter } from "./routes/manager.routes.js";
import { plansRouter } from "./routes/plans.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp(corsOrigin) {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/health", healthRouter);
  app.use("/api/plans", plansRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/manager", managerRouter);
  app.use("/api/integrations/calendly", calendlyRouter);

  app.use(errorHandler);
  return app;
}
