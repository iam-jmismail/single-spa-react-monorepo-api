import { NextFunction, Request, Response } from "express";

export class ValidationError extends Error {
  errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string>) {
    super();
    this.message = message;
    this.name = "ValidationError";
    this.errors = errors;
  }
}
export class ConflictException extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = "ConflictException";
  }
}

export class NotFoundException extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = "NotFoundException";
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    res.status(417).send({ message: err.message, errors: err.errors });
    return;
  }

  if (err instanceof ConflictException) {
    res.status(409).send({ message: err.message });
    return;
  }

  if (err instanceof NotFoundException) {
    res.status(404).send({ message: err.message });
    return;
  }

  console.log("error", err);

  res.status(500).send({ message: "Something went wrong!", error: err });
};
