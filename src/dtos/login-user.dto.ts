import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserReqDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  constructor(user: Partial<LoginUserReqDto>) {
    Object.assign(this, user);
  }
}
