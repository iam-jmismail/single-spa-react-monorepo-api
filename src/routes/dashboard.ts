import { Router } from "express";
import { DashboardController } from "@controllers/dashboard.controller";

const dashboardRoutes = Router();

import authenticate from "@middlewares/jwt.middleware";

dashboardRoutes.get("/", [authenticate], DashboardController.getMetrics);

export { dashboardRoutes };
