import { Router } from "express";
import { OrderController } from "@controllers/order.controller";

const orderRoutes = Router();

orderRoutes.post("/", OrderController.placeOrder);
orderRoutes.get("/", OrderController.listOrders);
// orderRoutes.put("/:productId", OrderController.updateProduct);

export { orderRoutes };
