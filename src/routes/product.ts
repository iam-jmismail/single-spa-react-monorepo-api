import { Router } from "express";
import { ProductController } from "@controllers/product.controller";

const productRoutes = Router();

productRoutes.post("/", ProductController.addProduct);
productRoutes.get("/:productId", ProductController.getProduct);
productRoutes.get("/", ProductController.listProducts);
productRoutes.delete("/:productId", ProductController.deleteProduct);
productRoutes.put("/:productId", ProductController.updateProduct);

export { productRoutes };
