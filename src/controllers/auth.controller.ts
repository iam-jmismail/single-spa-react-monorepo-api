import { NextFunction, Request, Response } from "express";
import { CreateUserRequestDto } from "@dtos/create-user.dto";
import { validateRequest } from "@lib/class-validator";
import User from "@models/user.model";
import { ConflictException, NotFoundException } from "@lib/error-handler";
import { JWTService } from "@services/jwt.service";
import { LoginUserReqDto } from "@dtos/login-user.dto";
import bcrypt from "bcryptjs";

export class AuthController {
  static async register(
    req: Request<void, void, CreateUserRequestDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await validateRequest(req.body, CreateUserRequestDto);

      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) throw new ConflictException("User already exists");

      const user = new User(req.body);
      await user.save();

      const token = JWTService.signToken({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res
        .status(200)
        .json({ message: "Success", auth_token: token, role: user.role });
      return;
    } catch (error) {
      next(error);
    }
  }
  static async login(
    req: Request<void, void, LoginUserReqDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await validateRequest(req.body, LoginUserReqDto);

      const user = await User.findOne({ email: req.body.email });
      if (!user) throw new NotFoundException("Invalid username or password");

      // Check Password
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isValidPassword)
        throw new NotFoundException("Invalid username or password");

      const token = JWTService.signToken({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res
        .status(200)
        .json({ message: "Success", auth_token: token, role: user.role });
      return;
    } catch (error) {
      next(error);
    }
  }
}
