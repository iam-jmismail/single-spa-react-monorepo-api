import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserTypes } from "@models/user.model";

config();

const SECRET_KEY = process.env.JWT_SECRET!;

export interface JwtPayload {
  name: string;
  email: string;
  role: UserTypes;
}

export interface ExpressRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs & {
    page?: number | undefined;
    limit?: number | undefined;
  }
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

const authenticate = (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default authenticate;
