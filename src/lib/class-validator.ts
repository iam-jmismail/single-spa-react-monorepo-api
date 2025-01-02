import { validate } from "class-validator";
import { ValidationError } from "./error-handler";

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
