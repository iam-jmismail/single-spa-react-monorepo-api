import { NextFunction, Request, Response } from "express";
import { validateRequest } from "@lib/class-validator";
import { ConflictException, NotFoundException } from "@lib/error-handler";
import { CreatProductDto } from "@dtos/create-product.dto";
import Product from "@models/product.model";
import mongoose, { Types } from "mongoose";

export class ProductController {
  static async addProduct(
    req: Request<void, void, CreatProductDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await validateRequest(req.body, CreatProductDto);

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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      if (!products.length) {
        res.status(200).send({
          message: "Success",
          data: [],
        });
        return;
      }

      res.status(200).send({
        message: "Success",
        data: products,
      });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async getProduct(
    req: Request<{ productId: string }>,
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
    req: Request<{ productId: string }, void, Partial<CreatProductDto>>,
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
    req: Request<{ productId: string }>,
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