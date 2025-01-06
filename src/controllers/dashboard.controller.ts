import { NextFunction, Response } from "express";
import Order from "@models/orders.model";
import { validateAdmin } from "@lib/validateRole.lib";
import { ExpressRequest } from "@middlewares/jwt.middleware";
import Product from "@models/product.model";
import User from "@models/user.model";

export class DashboardController {
  static async getMetrics(
    req: ExpressRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validateAdmin(req!.user!.role);

      const orders = await Order.find().countDocuments();
      const products = await Product.find().countDocuments({
        isDeleted: false,
      });
      const users = await User.find().countDocuments();

      res.status(200).send({
        message: "Success",
        data: {
          orders,
          products,
          users,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}
