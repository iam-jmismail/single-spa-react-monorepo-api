import { validate } from "class-validator";
import { ValidationError } from "./error-handler";
import { AddOrderDto } from "@dtos/add-order.dto";

export const validateRequest = async (
  data: any,
  Dto: { new (data: any): any }
) => {
  const dataInstance = new Dto(data);
  try {
    const errors = await validate(dataInstance);
    const errorMessages = errors.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.property] = Object.values(curr.constraints!)[0];
      return acc;
    }, {});

    if (Object.values(errorMessages).length > 0) {
      throw new ValidationError("Validation failed", errorMessages);
    }
  } catch (error) {
    throw error;
  }
};

export const validateOrder = (data: AddOrderDto): boolean => {
  if (!Array.isArray(data.products) || data.products.length < 1) {
    return false;
  }

  for (const product of data.products) {
    if (
      !product.productId ||
      typeof product.productId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(product.productId)
    ) {
      return false;
    }

    if (
      !product.quantity ||
      typeof product.quantity !== "number" ||
      product.quantity <= 0
    ) {
      return false;
    }
  }

  return true;
};
