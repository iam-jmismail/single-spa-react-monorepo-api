import { NextFunction, Response } from "express";
import { validateRequest } from "@lib/class-validator";
import { ConflictException, NotFoundException } from "@lib/error-handler";
import { CreatProductDto } from "@dtos/create-product.dto";
import Product from "@models/product.model";
import { ExpressRequest } from "@middlewares/jwt.middleware";
import mongoose, { Types } from "mongoose";
import { validateAdmin } from "@lib/validateRole.lib";

export class ProductController {
  static async addProduct(
    req: ExpressRequest<void, void, CreatProductDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await validateRequest(req.body, CreatProductDto);
      validateAdmin(req!.user!.role);

      const product = await Product.findOne({ name: req.body.name });
      if (product) throw new ConflictException("Product already exists");

      const newProduct = new Product(req.body);
      await newProduct.save();

      res.status(200).json({ message: "Success", data: newProduct });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async listProducts(
    req: ExpressRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = !req.query.page || +req.query.page < 0 ? 1 : +req.query.page;
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;

      const productsLength = await Product.find().countDocuments({
        isDeleted: false,
      });

      const meta = {
        currentPage: page,
        lastPage: Math.ceil(productsLength / limit),
        totalRecords: productsLength,
      };

      if (!productsLength) {
        res.status(200).send({
          message: "Success",
          data: [],
          meta,
        });
        return;
      }

      const products = await Product.find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

      res.status(200).send({
        message: "Success",
        data: products,
        meta,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async getProduct(
    req: ExpressRequest<{ productId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!mongoose.isValidObjectId(req.params.productId)) {
        res.status(417).send({
          message: "Invalid Product Id",
        });
        return;
      }

      const product = await Product.findOne({
        _id: new Types.ObjectId(req.params.productId),
        isDeleted: false,
      });
      if (!product) {
        res.status(404).send({
          message: "Product not found",
        });
        return;
      }

      res.status(200).send({
        message: "Success",
        data: product,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async updateProduct(
    req: ExpressRequest<{ productId: string }, void, Partial<CreatProductDto>>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    validateAdmin(req!.user!.role);

    try {
      if (!mongoose.isValidObjectId(req.params.productId)) {
        res.status(417).send({
          message: "Invalid Product Id",
        });
        return;
      }

      const updatedResult = await Product.updateOne(
        {
          _id: new Types.ObjectId(req.params.productId),
          isDeleted: false,
        },
        {
          $set: {
            ...req.body,
            updatedAt: new Date(),
          },
        }
      );

      if (updatedResult.modifiedCount === 0)
        throw new NotFoundException("Product not found!");

      res.status(204).send(null);
      return;
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: ExpressRequest<{ productId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    validateAdmin(req!.user!.role);
    try {
      if (!mongoose.isValidObjectId(req.params.productId)) {
        res.status(417).send({
          message: "Invalid Product Id",
        });
        return;
      }

      const updatedResult = await Product.updateOne(
        {
          _id: new Types.ObjectId(req.params.productId),
          isDeleted: false,
        },
        {
          $set: {
            isDeleted: true,
          },
        }
      );

      if (updatedResult.modifiedCount === 0)
        throw new NotFoundException("Product not found!");

      res.status(200).send({
        message: "Deleted successfully!",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}
