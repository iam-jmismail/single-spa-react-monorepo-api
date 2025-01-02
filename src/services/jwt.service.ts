import { IUser } from "@models/user.model";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export class JWTService {
  static jwtSecret = process.env.JWT_SECRET!;

  static signToken(payload: Partial<IUser>) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: "1d",
    });
  }
  static decodeToken(token: string) {
    return jwt.verify(token, this.jwtSecret);
  }
}
