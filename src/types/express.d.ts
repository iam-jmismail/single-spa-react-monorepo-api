import { JwtPayload } from "../middlewares/jwt.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
