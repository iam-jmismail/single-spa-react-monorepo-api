import { Router } from "express";
import { authRoutes } from "./auth";
import { productRoutes } from "./product";

const routes = Router();
routes.use("/auth", authRoutes);
routes.use("/product", productRoutes);

export { routes };
