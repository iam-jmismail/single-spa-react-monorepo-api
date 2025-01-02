import { Router } from "express";
import { ProductController } from "@controllers/product.controller";
import authenticate from "@middlewares/jwt.middleware";

const productRoutes = Router();

productRoutes.post("/", [authenticate], ProductController.addProduct);
productRoutes.get("/:productId", [authenticate], ProductController.getProduct);
productRoutes.get("/", [authenticate], ProductController.listProducts);
productRoutes.delete(
  "/:productId",
  [authenticate],
  ProductController.deleteProduct
);
productRoutes.put(
  "/:productId",
  [authenticate],
  ProductController.updateProduct
);

export { productRoutes };
