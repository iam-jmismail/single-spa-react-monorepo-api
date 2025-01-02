import {
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreatProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsISO4217CurrencyCode()
  @IsNotEmpty()
  currency!: string;

  constructor(data: Partial<CreatProductDto>) {
    Object.assign(this, data);
  }
}
