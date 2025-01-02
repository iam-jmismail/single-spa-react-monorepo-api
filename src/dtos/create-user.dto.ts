import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  constructor(user: Partial<CreateUserRequestDto>) {
    Object.assign(this, user);
  }
}
