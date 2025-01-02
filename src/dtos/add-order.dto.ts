import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class ProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}

export class AddOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products!: ProductDto[];

  constructor(data: Partial<AddOrderDto>) {
    Object.assign(this, data);
  }
}
