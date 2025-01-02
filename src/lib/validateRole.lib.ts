import { JwtPayload } from "@middlewares/jwt.middleware";
import { ForbiddenException } from "./error-handler";

export const validateAdmin = (role: JwtPayload["role"]) => {
  if (role !== 1) throw new ForbiddenException("Your are not authorized");
  return;
};

export const validateUser = (role: JwtPayload["role"]) => {
  if (role !== 2) throw new ForbiddenException("Your are not authorized");
  return;
};
