import { Router } from "express";
import { OrderController } from "@controllers/order.controller";

const orderRoutes = Router();

import authenticate from "@middlewares/jwt.middleware";

orderRoutes.post("/", [authenticate], OrderController.placeOrder);
orderRoutes.get("/", [authenticate], OrderController.listOrders);
orderRoutes.put("/:orderId", [authenticate], OrderController.updateOrder);

export { orderRoutes };
