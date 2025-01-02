import { Router } from "express";
import { AuthController } from "@controllers/auth.controller";

const authRoutes = Router();
authRoutes.post("/signup", AuthController.register);
authRoutes.post("/login", AuthController.login);

export { authRoutes };
