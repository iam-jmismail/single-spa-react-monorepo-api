import { NextFunction, Response } from "express";
import { validateOrder } from "@lib/class-validator";
import { NotFoundException, ValidationError } from "@lib/error-handler";
import Product, { IProduct } from "@models/product.model";
import mongoose, { Types } from "mongoose";
import { AddOrderDto, UpdateOrderStatusDto } from "@dtos/add-order.dto";
import Order, { IOrders } from "@models/orders.model";
import { validateAdmin, validateUser } from "@lib/validateRole.lib";
import { ExpressRequest } from "@middlewares/jwt.middleware";

export class OrderController {
  static async placeOrder(
    req: ExpressRequest<void, void, AddOrderDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validateUser(req!.user!.role);
      const isValid = validateOrder(req.body);
      if (!isValid)
        throw new ValidationError("Validation Failed", {
          message: "Invalid product object",
        });

      const productIds = req.body.products.map(
        (o) => new Types.ObjectId(o.productId)
      );
      const products = await Product.find({
        _id: {
          $in: productIds,
        },
      }).select("_id price currency");

      const totalOrderPrice = req.body.products.reduce((acc, curr) => {
        const productPrice =
          products.find((p) => String(p?._id) === String(curr.productId))
            ?.price || 0;
        acc += curr.quantity * productPrice;

        return acc;
      }, 0);

      const newOrder = new Order({
        products: req.body.products.map(({ productId, quantity }) => {
          const product = products.find(
            (p) => String(p?._id) === String(productId)
          );
          return {
            productId: product?._id,
            quantity,
          };
        }),
        totalOrderPrice,
      });

      await newOrder.save();

      res.status(200).json({ message: "Order Placed", data: newOrder });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async listOrders(
    req: ExpressRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      validateAdmin(req!.user!.role);
      const orders = await Order.aggregate<
        Partial<IOrders & { productsResult: IProduct[] }>
      >([
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productsResult",
          },
        },
      ]);

      if (!orders.length) {
        res.status(200).send({
          message: "Success",
          data: [],
        });
        return;
      }

      const orderResults = orders.map(
        ({
          _id,
          products,
          totalOrderPrice,
          productsResult,
          createdAt,
          updatedAt,
          status,
        }) => {
          const finalProducts = productsResult?.map((product) => {
            const quantity = products?.find(
              (o) => String(o.productId) === String(product._id)
            )?.quantity;

            return {
              quantity,
              name: product.name,
              description: product.description,
              price: product.price,
            };
          });

          return {
            _id,
            totalOrderPrice,
            products: finalProducts,
            createdAt,
            updatedAt,
            status,
          };
        }
      );

      res.status(200).send({
        message: "Success",
        data: orderResults,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async updateOrder(
    req: ExpressRequest<
      { orderId: string },
      void,
      Partial<UpdateOrderStatusDto>
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(req.params.orderId)) {
        res.status(417).send({
          message: "Invalid Order Id",
        });
        return;
      }

      const updatedResult = await Order.updateOne(
        {
          _id: new Types.ObjectId(req.params.orderId),
        },
        {
          $set: {
            updatedAt: new Date(),
            status: req.body.status,
          },
        }
      );

      if (updatedResult.modifiedCount === 0)
        throw new NotFoundException("Order not found!");

      res.status(204).send(null);
      return;
    } catch (error) {
      next(error);
    }
  }
}
