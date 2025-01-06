import { Router } from "express";
import { authRoutes } from "./auth";
import { productRoutes } from "./product";
import { orderRoutes } from "./orders";
import { dashboardRoutes } from "./dashboard";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/product", productRoutes);
routes.use("/order", orderRoutes);
routes.use("/dashboard", dashboardRoutes);

export { routes };
